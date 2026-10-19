import type { Metadata } from "next";
import { delegacion } from "@/lib/contenido";
import { CabeceraPagina, Titulo } from "@/app/componentes";

export const metadata: Metadata = {
  title: "Delegación Olímpica",
  description: delegacion.descripcion,
};

function Iniciales({ nombre }: { nombre: string }) {
  const letras = nombre
    .replace(/^(Dr|Ing|Lic)\.\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <span
      className="grid size-14 shrink-0 place-items-center rounded-xl border-2 border-tinta bg-mostaza font-mono text-lg font-medium"
      aria-hidden
    >
      {letras}
    </span>
  );
}

export default function DelegacionOlimpica() {
  const { delegado, lideres, comite } = delegacion;
  return (
    <>
      <CabeceraPagina
        antetitulo="Estado de Chihuahua · Olimpiada Mexicana de Informática"
        titulo="Delegación Olímpica"
        descripcion={delegacion.descripcion}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <article className="overflow-hidden rounded-3xl border-2 border-tinta bg-arena-50 shadow-[6px_6px_0_var(--cafe)]">
          <div className="franjas-h h-3" aria-hidden />
          <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-start sm:p-9">
            <Iniciales nombre={delegado.nombre} />
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-ladrillo">{delegado.cargo}</p>
              <h2 className="mt-1 font-display text-3xl font-bold">{delegado.nombre}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {delegado.enlaces.map((e) => (
                  <li key={e.etiqueta}>
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-md border-2 border-tinta/25 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-tinta-suave hover:border-tinta hover:text-tinta"
                    >
                      {e.etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {lideres.map((l) => (
            <article
              key={l.nombre}
              className="flex items-center gap-5 rounded-2xl border-2 border-tinta bg-arena-50 p-6 shadow-[4px_4px_0_var(--cafe)]"
            >
              <Iniciales nombre={l.nombre} />
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ladrillo">{l.cargo}</p>
                <h3 className="mt-1 font-display text-2xl font-bold">{l.nombre}</h3>
              </div>
            </article>
          ))}
        </div>

        <section id="comite-olimpico" className="mt-20">
          <Titulo antetitulo="COMICHH">Comité Olímpico del Estado de Chihuahua</Titulo>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comite.map((nombre, i) => (
              <li key={nombre} className="rounded-2xl border-2 border-tinta/25 bg-arena-50 p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ladrillo">
                  {String(i + 1).padStart(2, "0")} · Integrante del COMICHH
                </p>
                <p className="mt-2 text-lg font-medium">{nombre}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
