"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import { cerrarSesion, exigirAdmin, iniciarSesion } from "./sesion";

export async function entrar(_: { error?: string }, f: FormData): Promise<{ error?: string }> {
  const correo = String(f.get("correo") ?? "");
  const contrasena = String(f.get("contrasena") ?? "");
  if (!correo || !contrasena) return { error: "Escribe tu correo y tu contraseña." };
  if (!(await iniciarSesion(correo, contrasena))) {
    // Pausa breve para frenar intentos repetidos
    await new Promise((r) => setTimeout(r, 700));
    return { error: "Correo o contraseña incorrectos." };
  }
  redirect("/admin");
}

export async function salir() {
  await cerrarSesion();
  redirect("/admin/entrar");
}

const ESTADOS = {
  competidores: ["pendiente", "contactado", "aceptado", "descartado"],
  entrenadores: ["pendiente", "validado", "rechazado"],
  escuelas: ["validada", "propuesta", "rechazada"],
} as const;

export async function cambiarEstado(f: FormData) {
  await exigirAdmin();
  const tabla = String(f.get("tabla")) as keyof typeof ESTADOS;
  const estado = String(f.get("estado"));
  const id = Number(f.get("id"));
  // La tabla y el estado salen de listas cerradas: nunca se interpola texto del usuario
  if (!(tabla in ESTADOS) || !(ESTADOS[tabla] as readonly string[]).includes(estado) || !Number.isInteger(id)) return;
  await (await db()).execute({ sql: `UPDATE ${tabla} SET estado = ? WHERE id = ?`, args: [estado, id] });
  revalidatePath("/admin", "layout");
}
