import type { Metadata } from "next";
import { competencias, objetivosOmi, queEsOmi, queEsOmichh } from "@/lib/contenido";
import { ACERTIJO, COMPUTADORA, KAREL } from "@/app/arte-ascii";
import { CabeceraPagina, Cartucho, Fondo, PanelAviso, Titulo } from "@/app/componentes";
import { ListaAscii } from "@/app/(sitio)/convocatoria/pagina-convocatoria";

export const metadata: Metadata = {
  title: "¿Qué es la OMI?",
  description:
    "La Olimpiada Mexicana de Informática busca y forma a los mejores jóvenes programadores del país. Conoce la ruta de Chihuahua.",
};

const ARTE = [COMPUTADORA, KAREL, ACERTIJO];

export default function QueEsLaOmi() {
  return (
    <>
      <CabeceraPagina
        antetitulo="OMICHH · Delegación Chihuahua"
        titulo="¿Qué es la OMI?"
        descripcion="Olimpiada Mexicana de Informática: el concurso que busca y forma a los mejores jóvenes programadores del país, y la ruta de Chihuahua hacia las competencias nacionales e internacionales."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl font-bold">¿Qué es la OMICHH?</h2>
          <p className="mt-4 text-lg text-tinta-suave">{queEsOmichh}</p>
        </section>
        <section>
          <h2 className="font-display text-3xl font-bold">OMI — Olimpiada Mexicana de Informática</h2>
          <p className="mt-4 text-lg text-tinta-suave">{queEsOmi}</p>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border-2 border-tinta bg-arena-50 p-8 shadow-[6px_6px_0_var(--cafe)] sm:p-10">
          <h2 className="font-display text-3xl font-bold">Objetivos de la OMI</h2>
          <div className="mt-2 text-lg text-tinta-suave">
            <ListaAscii elementos={objetivosOmi} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y-2 border-tinta bg-arena-50 py-20">
        <Fondo patron="perforada" tono="suave" className="opacity-70" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Titulo antetitulo="Las competencias">Elige tu competencia</Titulo>
          <div className="grid gap-8 lg:grid-cols-3">
            {competencias.map((c, i) => (
              <Cartucho key={c.siglas} competencia={c} numero={i + 1} arte={ARTE[i]} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <PanelAviso
          titulo="¿Listo para participar?"
          texto="Realiza tu preregistro en línea y te contactaremos con los siguientes pasos."
          accion={{ etiqueta: "Ir al preregistro", href: "/preregistro" }}
        />
      </div>
    </>
  );
}
