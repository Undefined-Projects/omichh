import type { Metadata } from "next";
import { enlacesPlataforma, escuelasConEntrenador, sitio } from "@/lib/contenido";
import { Boton, CabeceraPagina } from "@/app/componentes";

export const metadata: Metadata = {
  title: "Entrenadores y escuelas",
  description: "Directorio de entrenadores y profesores que participan oficialmente con la OMICHH.",
};

function solicitarContacto(entrenador: string) {
  const asunto = `Solicitud de contacto con entrenador: ${entrenador}`;
  const cuerpo = `Hola, equipo OMICHH.\n\nMe gustaría contactar a ${entrenador}.\n\nCURP o correo de mi preregistro:\nMensaje:\n`;
  return `mailto:${sitio.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}

export default function Entrenadores() {
  return (
    <>
      <CabeceraPagina
        antetitulo="Directorio oficial"
        titulo="Entrenadores y escuelas"
        descripcion="Directorio de entrenadores y profesores que participan oficialmente con la OMICHH. Si buscas asesor para tu participación, inicia el preregistro para que podamos dar seguimiento con tus datos completos."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Boton href={enlacesPlataforma.preregistroCompetidor}>Preregistro de competidor</Boton>
          <Boton href={enlacesPlataforma.preregistroEntrenador} variante="mostaza">
            Preregistro de entrenador
          </Boton>
        </div>
      </CabeceraPagina>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="max-w-3xl rounded-2xl border-2 border-dashed border-tinta/30 bg-arena-50 p-5 text-tinta-suave">
          Por seguridad de nuestros entrenadores no publicamos sus correos. Para que te asignemos o
          contactar a un entrenador, realiza tu preregistro o escríbenos a{" "}
          <a href={`mailto:${sitio.correo}`} className="font-medium text-ladrillo underline underline-offset-4">
            {sitio.correo}
          </a>
          .
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {escuelasConEntrenador.map((e) => (
            <article
              key={e.escuela}
              className="flex flex-col overflow-hidden rounded-2xl border-2 border-tinta bg-arena-50 shadow-[4px_4px_0_var(--cafe)]"
            >
              <div className="bg-arena-200 px-6 py-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
                  {e.ciudad}, Chihuahua{e.nivel && ` · ${e.nivel}`}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold leading-tight">{e.escuela}</h2>
              </div>
              <div className="franjas-h h-2" aria-hidden />
              <ul className="flex-1 divide-y-2 divide-dashed divide-tinta/10 px-6">
                {e.entrenadores.map((t) => (
                  <li key={t.nombre} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div>
                      <p className="font-medium">{t.nombre}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
                        Entrenador · {t.ciudad}
                      </p>
                    </div>
                    <a
                      href={solicitarContacto(t.nombre)}
                      className="font-mono text-xs uppercase tracking-wider text-ladrillo hover:text-tinta"
                    >
                      Solicitar contacto →
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-12 text-tinta-suave">
          ¿No tienes un entrenador específico?{" "}
          <a href={solicitarContacto("sin entrenador específico")} className="font-medium text-ladrillo underline underline-offset-4">
            Quiero que me asignen entrenador
          </a>
          .
        </p>
      </div>
    </>
  );
}
