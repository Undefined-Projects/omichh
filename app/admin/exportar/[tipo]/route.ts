import { exportar } from "@/lib/datos-admin";
import { adminActual } from "@/lib/sesion";

const TIPOS = ["competidores", "entrenadores", "escuelas"] as const;

// Una celda CSV: entre comillas si hace falta; se neutraliza el inicio con = + - @
// para que Excel no la interprete como fórmula
function celda(valor: unknown) {
  let t = valor === null || valor === undefined ? "" : String(valor);
  if (/^[=+\-@]/.test(t)) t = `'${t}`;
  return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}

export async function GET(_: Request, { params }: RouteContext<"/admin/exportar/[tipo]">) {
  if (!(await adminActual())) return new Response("No autorizado", { status: 401 });
  const { tipo } = await params;
  if (!(TIPOS as readonly string[]).includes(tipo)) return new Response("No encontrado", { status: 404 });

  const { columnas, filas } = await exportar(tipo as (typeof TIPOS)[number]);
  const csv = [columnas, ...filas].map((fila) => fila.map(celda).join(",")).join("\r\n");
  const fecha = new Date().toISOString().slice(0, 10);
  // BOM para que Excel abra bien los acentos
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="omichh-${tipo}-${fecha}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
