import type { Metadata } from "next";
import { bebras } from "@/lib/contenido";
import { ACERTIJO, Ilustracion } from "@/app/arte-ascii";
import { CabeceraPagina, Fondo, PanelAviso } from "@/app/componentes";

export const metadata: Metadata = {
  title: "Bebras",
  description:
    "Reto internacional de pensamiento computacional, en línea, en español, sin costo y sin necesidad de programar.",
};

export default function Bebras() {
  return (
    <>
      <CabeceraPagina
        antetitulo="Reto de pensamiento computacional"
        titulo="Bebras"
        descripcion="Un reto internacional, en línea y sin necesidad de saber programar, para descubrir y desarrollar el pensamiento computacional a cualquier edad."
      />

      <div className="relative overflow-hidden bg-arena-100">
        <Fondo patron="acertijos" tono="suave" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-5 text-lg text-tinta-suave">
              {bebras.descripcion.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="justify-self-center rounded-3xl border-2 border-tinta bg-arena-200 p-8 shadow-[6px_6px_0_var(--cafe)]">
              <Ilustracion lineas={ACERTIJO} />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {bebras.cifras.map((c) => (
              <div key={c.etiqueta} className="rounded-2xl border-2 border-tinta bg-arena-50 p-6 shadow-[4px_4px_0_var(--cafe)]">
                <p className="font-display text-5xl font-bold text-ladrillo">{c.valor}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-tinta-suave">{c.etiqueta}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <PanelAviso
              titulo="Bebras 2026"
              texto={bebras.aviso}
              accion={{ etiqueta: "Ir al preregistro", href: "/preregistro" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
