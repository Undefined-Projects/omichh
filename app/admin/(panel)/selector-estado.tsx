"use client";

import { useTransition } from "react";
import { cambiarEstado } from "@/lib/acciones-admin";

const ESTILO: Record<string, string> = {
  pendiente: "bg-mostaza/30",
  contactado: "bg-arena-200",
  propuesta: "bg-mostaza/30",
  aceptado: "bg-papel-banda",
  validado: "bg-papel-banda",
  validada: "bg-papel-banda",
  descartado: "bg-arena-300/60 text-tinta-suave",
  rechazado: "bg-arena-300/60 text-tinta-suave",
  rechazada: "bg-arena-300/60 text-tinta-suave",
};

// Cambia el estado de un registro en cuanto se elige otra opción
export function SelectorEstado({ tabla, id, estado, opciones }: { tabla: string; id: number; estado: string; opciones: readonly string[] }) {
  const [pendiente, iniciar] = useTransition();
  return (
    <select
      aria-label="Estado"
      defaultValue={estado}
      disabled={pendiente}
      onChange={(e) => {
        const f = new FormData();
        f.set("tabla", tabla);
        f.set("id", String(id));
        f.set("estado", e.target.value);
        iniciar(() => cambiarEstado(f));
      }}
      className={`rounded-md border-2 border-tinta/30 px-2 py-1 font-mono text-[11px] uppercase tracking-wider disabled:opacity-50 ${ESTILO[estado] ?? ""}`}
    >
      {opciones.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
