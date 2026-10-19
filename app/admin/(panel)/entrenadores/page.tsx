import type { Metadata } from "next";
import { Suspense } from "react";
import { listarEntrenadores } from "@/lib/datos-admin";
import { BotonExportar, Cargando, EncabezadoPanel, fechaCorta, Tabla } from "../piezas";
import { SelectorEstado } from "../selector-estado";

export const metadata: Metadata = { title: "Entrenadores" };

const ESTADOS = ["pendiente", "validado", "rechazado"] as const;

export default function Entrenadores() {
  return (
    <>
      <EncabezadoPanel titulo="Entrenadores" nota="Preregistros de entrenadores y profesores; los pendientes van primero.">
        <BotonExportar tipo="entrenadores" />
      </EncabezadoPanel>
      <Suspense fallback={<Cargando />}>
        <Listado />
      </Suspense>
    </>
  );
}

async function Listado() {
  const lista = await listarEntrenadores();
  return (
    <Tabla columnas={["Nombre", "Edad", "Escuela", "Municipio", "Contacto", "omegaUp", "Fecha", "Estado"]} vacia={lista.length === 0}>
      {lista.map((e) => (
        <tr key={e.id} className="align-top hover:bg-papel-banda/60">
          <td className="px-3 py-2.5">
            <p className="font-medium">{e.nombre}</p>
            <p className="font-mono text-[11px] text-tinta-suave">{e.curp}</p>
          </td>
          <td className="px-3 py-2.5 font-mono tabular-nums">
            {e.edad}
            <span className="block text-[10px] text-tinta-suave">{e.sexo}</span>
          </td>
          <td className="px-3 py-2.5">
            {e.escuela}
            {e.escuelaPropuesta && (
              <span className="mt-1 block w-fit rounded bg-mostaza/30 px-1.5 font-mono text-[10px] uppercase">escuela propuesta</span>
            )}
          </td>
          <td className="px-3 py-2.5">{e.municipio}</td>
          <td className="px-3 py-2.5 text-xs">
            <a href={`mailto:${e.correo}`} className="text-ladrillo underline-offset-2 hover:underline">
              {e.correo}
            </a>
            <p className="font-mono">{e.celular}</p>
          </td>
          <td className="px-3 py-2.5 font-mono text-xs">{e.omegaup || "—"}</td>
          <td className="whitespace-nowrap px-3 py-2.5 text-xs text-tinta-suave">{fechaCorta(e.creado)}</td>
          <td className="px-3 py-2.5">
            <SelectorEstado tabla="entrenadores" id={e.id} estado={e.estado} opciones={ESTADOS} />
          </td>
        </tr>
      ))}
    </Tabla>
  );
}
