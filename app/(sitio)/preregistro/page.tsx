import type { Metadata } from "next";
import { preregistro, sitio } from "@/lib/contenido";
import { Boton, CabeceraPagina } from "@/app/componentes";
import { ListaAscii } from "@/app/(sitio)/convocatoria/pagina-convocatoria";

export const metadata: Metadata = {
  title: "Preregistro en línea",
  description: "Preregistro de entrenadores, profesores y competidores de la OMICHH.",
};

export default function Preregistro() {
  return (
    <>
      <CabeceraPagina
        antetitulo="Entrenadores / Competidores"
        titulo="Preregistro en línea"
        descripcion="Selecciona el trámite que deseas realizar. La convocatoria OMI 2026 ya cerró, pero el preregistro permanece abierto: las nuevas solicitudes se considerarán para las siguientes convocatorias."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {preregistro.map((p, i) => (
            <article
              key={p.titulo}
              className="flex flex-col overflow-hidden rounded-3xl border-2 border-tinta bg-arena-50 shadow-[6px_6px_0_var(--cafe)]"
            >
              <div className="bg-arena-200 px-7 pb-4 pt-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
                  Trámite {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">{p.titulo}</h2>
              </div>
              <div className="franjas-h h-3" aria-hidden />
              <div className="flex flex-1 flex-col p-7">
                <p className="text-tinta-suave">{p.texto}</p>
                {p.datos.length > 0 && (
                  <div className="mt-5 text-sm text-tinta-suave">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ladrillo">
                      &gt; Ten a la mano
                    </p>
                    <ListaAscii elementos={p.datos} />
                  </div>
                )}
                <div className="mt-auto pt-7">
                  <Boton href={p.accion.href} variante={i === 2 ? "claro" : i === 0 ? "mostaza" : "tinta"}>
                    {p.accion.etiqueta}
                  </Boton>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-3xl text-tinta-suave">
          Los datos se usan únicamente con fines de organización de la OMICHH, conforme al aviso de
          privacidad que aceptas al enviar tu preregistro. ¿Necesitas ayuda? Escríbenos a{" "}
          <a href={`mailto:${sitio.correo}`} className="font-medium text-ladrillo underline underline-offset-4">
            {sitio.correo}
          </a>{" "}
          o por{" "}
          <a
            href={`https://wa.me/${sitio.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ladrillo underline underline-offset-4"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    </>
  );
}
