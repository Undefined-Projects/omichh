import type { Metadata } from "next";
import { Suspense } from "react";
import { estiloControl } from "@/app/(sitio)/preregistro/campos";
import { CONCURSOS, MUNICIPIOS, NIVELES_ESCOLARES } from "@/lib/catalogos";
import { listarCompetidores, type FiltrosCompetidores } from "@/lib/datos-admin";
import { BotonExportar, Cargando, EncabezadoPanel, fechaCorta, Tabla } from "../piezas";
import { SelectorEstado } from "../selector-estado";

export const metadata: Metadata = { title: "Competidores" };

const ESTADOS = ["pendiente", "contactado", "aceptado", "descartado"] as const;

export default function Competidores({ searchParams }: PageProps<"/admin/competidores">) {
  return (
    <>
      <EncabezadoPanel titulo="Competidores" nota="Preregistros de estudiantes. El estado se guarda al cambiarlo.">
        <BotonExportar tipo="competidores" />
      </EncabezadoPanel>
      <Suspense fallback={<Cargando />}>
        <Listado searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Listado({ searchParams }: { searchParams: PageProps<"/admin/competidores">["searchParams"] }) {
  const p = await searchParams;
  const uno = (k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
  const filtros: FiltrosCompetidores = { q: uno("q"), concurso: uno("concurso"), nivel: uno("nivel"), estado: uno("estado"), municipio: uno("municipio") };
  const lista = await listarCompetidores(filtros);
  const control = `${estiloControl} py-2 text-sm`;

  return (
    <>
      <form className="mb-6 grid gap-3 rounded-2xl border-2 border-tinta/20 bg-arena-50 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
        <input name="q" defaultValue={filtros.q} placeholder="Buscar nombre, CURP, correo o escuela" aria-label="Buscar" className={control} />
        <select name="concurso" defaultValue={filtros.concurso} aria-label="Concurso" className={control}>
          <option value="">Todo concurso</option>
          {CONCURSOS.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.etiqueta.replace(" / aún no sé", "")}
            </option>
          ))}
        </select>
        <select name="nivel" defaultValue={filtros.nivel} aria-label="Nivel" className={control}>
          <option value="">Todo nivel</option>
          {NIVELES_ESCOLARES.map((n) => (
            <option key={n.valor} value={n.valor}>
              {n.etiqueta}
            </option>
          ))}
        </select>
        <select name="estado" defaultValue={filtros.estado} aria-label="Estado" className={control}>
          <option value="">Todo estado</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e[0].toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>
        <select name="municipio" defaultValue={filtros.municipio} aria-label="Municipio" className={control}>
          <option value="">Todo municipio</option>
          {MUNICIPIOS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="tecla rounded-lg border-2 border-tinta bg-tinta px-4 py-2 font-mono text-xs uppercase tracking-wider text-arena-50">
          Filtrar
        </button>
      </form>

      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-tinta-suave">
        {lista.length} {lista.length === 1 ? "registro" : "registros"}
        {lista.length === 500 && " (se muestran los 500 más recientes; usa los filtros o exporta a CSV)"}
      </p>
      <Tabla columnas={["Nombre", "Edad", "Concurso", "Escuela", "Municipio", "Contacto", "Fecha", "Estado"]} vacia={lista.length === 0}>
        {lista.map((c) => (
          <tr key={c.id} className="align-top hover:bg-papel-banda/60">
            <td className="px-3 py-2.5">
              <p className="font-medium">{c.nombre}</p>
              <p className="font-mono text-[11px] text-tinta-suave">{c.curp}</p>
              {c.comentarios && (
                <details className="mt-1 max-w-xs text-xs text-tinta-suave">
                  <summary className="cursor-pointer">Comentarios</summary>
                  {c.comentarios}
                </details>
              )}
            </td>
            <td className="px-3 py-2.5 font-mono tabular-nums">
              {c.edad}
              <span className="block text-[10px] text-tinta-suave">{c.sexo}</span>
              {!c.cumpleEdadOmi && <span className="block text-[10px] text-ladrillo" title="Nació antes del 1 de julio de 2007">fuera de edad OMI</span>}
            </td>
            <td className="px-3 py-2.5 font-mono text-xs uppercase">{c.concurso}</td>
            <td className="px-3 py-2.5">
              <p>{c.escuela}</p>
              <p className="text-xs text-tinta-suave">
                {c.nivel} · {c.anio}
              </p>
            </td>
            <td className="px-3 py-2.5">{c.municipio}</td>
            <td className="px-3 py-2.5 text-xs">
              <a href={`mailto:${c.correo}`} className="text-ladrillo underline-offset-2 hover:underline">
                {c.correo}
              </a>
              <p className="font-mono">{c.celular}</p>
              {c.telefono && <p className="font-mono text-tinta-suave">{c.telefono}</p>}
            </td>
            <td className="whitespace-nowrap px-3 py-2.5 text-xs text-tinta-suave">{fechaCorta(c.creado)}</td>
            <td className="px-3 py-2.5">
              <SelectorEstado tabla="competidores" id={c.id} estado={c.estado} opciones={ESTADOS} />
            </td>
          </tr>
        ))}
      </Tabla>
    </>
  );
}
