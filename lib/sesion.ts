import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

const scryptAsync = promisify(scrypt) as (clave: string, sal: Buffer, largo: number) => Promise<Buffer>;

const COOKIE = "omichh_sesion";
const DURACION_HORAS = 12;

// Formato guardado: scrypt$<sal hex>$<hash hex>. scripts/crear-admin.mjs usa el mismo.
export async function cifrarContrasena(contrasena: string) {
  const sal = randomBytes(16);
  const hash = await scryptAsync(contrasena, sal, 64);
  return `scrypt$${sal.toString("hex")}$${hash.toString("hex")}`;
}

async function contrasenaCorrecta(contrasena: string, guardada: string) {
  const [esquema, salHex, hashHex] = guardada.split("$");
  if (esquema !== "scrypt" || !salHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, "hex");
  const calculado = await scryptAsync(contrasena, Buffer.from(salHex, "hex"), esperado.length);
  return timingSafeEqual(calculado, esperado);
}

// En la base solo se guarda el hash del token: una copia de la base no da acceso
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export type Admin = { id: number; correo: string; nombre: string };

export async function iniciarSesion(correo: string, contrasena: string): Promise<boolean> {
  const base = await db();
  const { rows } = await base.execute({
    sql: "SELECT id, contrasena FROM administradores WHERE correo = ?",
    args: [correo.trim().toLowerCase()],
  });
  // Siempre se calcula un hash, exista o no el correo, para no revelar cuál existe
  const guardada = rows[0] ? String(rows[0].contrasena) : `scrypt$${"0".repeat(32)}$${"0".repeat(128)}`;
  const correcta = await contrasenaCorrecta(contrasena, guardada);
  if (!rows[0] || !correcta) return false;

  const token = randomBytes(32).toString("base64url");
  const expira = new Date(Date.now() + DURACION_HORAS * 3600_000);
  await base.batch(
    [
      { sql: "DELETE FROM sesiones WHERE expira_en < datetime('now')", args: [] },
      {
        sql: "INSERT INTO sesiones (token, admin_id, expira_en) VALUES (?, ?, ?)",
        args: [hashToken(token), Number(rows[0].id), expira.toISOString().replace("T", " ").slice(0, 19)],
      },
    ],
    "write",
  );
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expira,
  });
  return true;
}

export async function cerrarSesion() {
  const almacen = await cookies();
  const token = almacen.get(COOKIE)?.value;
  if (token) {
    await (await db()).execute({ sql: "DELETE FROM sesiones WHERE token = ?", args: [hashToken(token)] });
  }
  almacen.delete(COOKIE);
}

export async function adminActual(): Promise<Admin | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const { rows } = await (await db()).execute({
    sql: `SELECT a.id, a.correo, a.nombre FROM sesiones s
          JOIN administradores a ON a.id = s.admin_id
          WHERE s.token = ? AND s.expira_en > datetime('now')`,
    args: [hashToken(token)],
  });
  const fila = rows[0];
  return fila ? { id: Number(fila.id), correo: String(fila.correo), nombre: String(fila.nombre) } : null;
}

// Capa de acceso: toda página, acción o ruta del panel pasa por aquí
export async function exigirAdmin(): Promise<Admin> {
  const admin = await adminActual();
  if (!admin) redirect("/admin/entrar");
  return admin;
}
