import type { Metadata } from "next";
import { competidores } from "@/lib/contenido";
import { CabeceraPagina, Fondo, Listado } from "@/app/componentes";

export const metadata: Metadata = {
  title: "Competidores 2026",
  description: competidores.descripcion,
};

export default function Competidores() {
  return (
    <>
      <CabeceraPagina antetitulo="Convocatoria 2026" titulo="Competidores" descripcion={competidores.descripcion} />

      <div className="relative overflow-hidden bg-arena-100">
        <Fondo patron="rejilla" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Listado encabezado={`OMICHH · ${competidores.lista.length} competidores aceptados`}>
            <div className="hidden grid-cols-[2.5rem_1.3fr_4rem_1.6fr_7rem] gap-4 border-b-2 border-dashed border-tinta/15 px-6 py-3 text-[11px] uppercase tracking-wider text-tinta-suave md:grid">
              <span>#</span>
              <span>Nombre</span>
              <span>Concurso</span>
              <span>Escuela</span>
              <span>Nivel</span>
            </div>
            <ol>
              {competidores.lista.map((c, i) => (
                <li
                  key={c.nombre}
                  className="grid gap-x-4 gap-y-1 px-4 py-3 odd:bg-papel-banda sm:px-6 md:grid-cols-[2.5rem_1.3fr_4rem_1.6fr_7rem] md:items-baseline"
                >
                  <span className="text-sm text-ladrillo">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-sans font-medium">{c.nombre}</span>
                  <span className="text-xs uppercase tracking-wider">{c.concurso}</span>
                  <span className="font-sans text-sm text-tinta-suave">{c.escuela}</span>
                  <span className="text-xs uppercase tracking-wider text-tinta-suave">{c.nivel}</span>
                </li>
              ))}
            </ol>
            <p className="border-t-2 border-dashed border-tinta/15 px-4 py-3 text-[11px] uppercase tracking-wider text-tinta-suave sm:px-6">
              [✓] Todas y todos cumplen el criterio: {competidores.criterio}
            </p>
          </Listado>
        </div>
      </div>
    </>
  );
}
