// Crea (o actualiza la contraseña de) un administrador del panel.
// Uso: npm run admin:crear -- correo@ejemplo.org "Nombre Apellido"
// La contraseña se pide en la terminal y no se muestra mientras se escribe.

import { mkdirSync } from "node:fs";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { createClient } from "@libsql/client";

const [correoArg, ...nombrePartes] = process.argv.slice(2);
const correo = correoArg?.trim().toLowerCase();
const nombre = nombrePartes.join(" ").trim();
if (!correo || !correo.includes("@") || !nombre) {
  console.error('Uso: npm run admin:crear -- correo@ejemplo.org "Nombre Apellido"');
  process.exit(1);
}

// Lee la entrada carácter por carácter sin mostrarla. Si no es una terminal (por
// ejemplo, al recibir la contraseña por tubería), la lee por líneas.
const pendientes = [];
let resolverPendiente = null;
let resto = "";
let ultimoFueRetorno = false;
process.stdin.setRawMode?.(true);
process.stdin.on("data", (buffer) => {
  for (const c of buffer.toString("utf8")) {
    if (c === "\u0003") process.exit(130); // Ctrl+C
    const saltoTrasRetorno = c === "\n" && ultimoFueRetorno; // "\r\n" cuenta como un solo fin de línea
    ultimoFueRetorno = c === "\r";
    if (saltoTrasRetorno) continue;
    if (c === "\r" || c === "\n") {
      pendientes.push(resto);
      resto = "";
    } else if (c === "\u007f") resto = resto.slice(0, -1);
    else resto += c;
  }
  if (resolverPendiente && pendientes.length) {
    const r = resolverPendiente;
    resolverPendiente = null;
    r(pendientes.shift());
  }
});

function preguntarOculto(texto) {
  process.stdout.write(texto);
  return new Promise((resolver) => {
    const listo = (v) => {
      process.stdout.write("\n");
      resolver(v);
    };
    if (pendientes.length) listo(pendientes.shift());
    else resolverPendiente = listo;
  });
}

const contrasena = await preguntarOculto("Contraseña (mínimo 12 caracteres): ");
if (contrasena.length < 12) {
  console.error("La contraseña debe tener al menos 12 caracteres.");
  process.exit(1);
}
if ((await preguntarOculto("Repítela: ")) !== contrasena) {
  console.error("Las contraseñas no coinciden.");
  process.exit(1);
}
process.stdin.setRawMode?.(false);
process.stdin.pause();

// Mismo formato que lib/sesion.ts: scrypt$<sal hex>$<hash hex>
const sal = randomBytes(16);
const hash = await promisify(scrypt)(contrasena, sal, 64);
const guardada = `scrypt$${sal.toString("hex")}$${hash.toString("hex")}`;

const url = process.env.TURSO_DATABASE_URL ?? "file:datos/omichh.db";
if (url.startsWith("file:")) mkdirSync("datos", { recursive: true });
const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
await db.execute(`CREATE TABLE IF NOT EXISTS administradores (
  id INTEGER PRIMARY KEY AUTOINCREMENT, correo TEXT NOT NULL UNIQUE, nombre TEXT NOT NULL,
  contrasena TEXT NOT NULL, creado_en TEXT NOT NULL DEFAULT (datetime('now')))`);
await db.execute({
  sql: `INSERT INTO administradores (correo, nombre, contrasena) VALUES (?, ?, ?)
        ON CONFLICT(correo) DO UPDATE SET nombre = excluded.nombre, contrasena = excluded.contrasena`,
  args: [correo, nombre, guardada],
});
console.log(`Listo: ${correo} puede entrar en /admin/entrar`);
