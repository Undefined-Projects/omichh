import type { Metadata } from "next";
import { Suspense } from "react";
import { listarEscuelas } from "@/lib/datos-admin";
import { BotonExportar, Cargando, EncabezadoPanel, Tabla } from "../piezas";
import { SelectorEstado } from "../selector-estado";

export const metadata: Metadata = { title: "Escuelas" };

const ESTADOS = ["propuesta", "validada", "rechazada"] as const;

export default function Escuelas() {
  return (
    <>
      <EncabezadoPanel
        titulo="Escuelas"
        nota="Catálogo del preregistro de entrenadores. Las propuestas aparecen en el formulario cuando se validan."
      >
        <BotonExportar tipo="escuelas" />
      </EncabezadoPanel>
      <Suspense fallback={<Cargando />}>
        <Listado />
      </Suspense>
    </>
  );
}

async function Listado() {
  const lista = await listarEscuelas();
  const propuestas = lista.filter((e) => e.estado === "propuesta").length;
  return (
    <>
      {propuestas > 0 && (
        <p className="mb-4 rounded-xl border-2 border-dashed border-naranja bg-arena-50 px-4 py-3 font-mono text-xs uppercase tracking-wider text-ladrillo">
          [!] {propuestas} {propuestas === 1 ? "escuela propuesta espera" : "escuelas propuestas esperan"} revisión
        </p>
      )}
      <Tabla columnas={["Escuela", "Municipio", "Nivel", "Entrenadores", "Estado"]} vacia={lista.length === 0}>
        {lista.map((e) => (
          <tr key={e.id} className={`align-top hover:bg-papel-banda/60 ${e.estado === "propuesta" ? "bg-mostaza/10" : ""}`}>
            <td className="px-3 py-2.5">
              <p className="font-medium">{e.nombre}</p>
              {e.corto && <p className="text-xs text-tinta-suave">{e.corto}</p>}
            </td>
            <td className="px-3 py-2.5">{e.municipio}</td>
            <td className="px-3 py-2.5 text-xs">{e.nivel}</td>
            <td className="px-3 py-2.5 font-mono tabular-nums">{e.entrenadores}</td>
            <td className="px-3 py-2.5">
              <SelectorEstado tabla="escuelas" id={e.id} estado={e.estado} opciones={ESTADOS} />
            </td>
          </tr>
        ))}
      </Tabla>
    </>
  );
}
