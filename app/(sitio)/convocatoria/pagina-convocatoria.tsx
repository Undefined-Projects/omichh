import type { Convocatoria } from "@/lib/contenido";
import { sitio } from "@/lib/contenido";
import { Trofeo } from "@/app/arte-ascii";
import { CabeceraPagina, FilasFechas, Fondo, Listado, PanelAviso } from "@/app/componentes";

export function PaginaConvocatoria({ convocatoria: c }: { convocatoria: Convocatoria }) {
  return (
    <>
      <CabeceraPagina antetitulo={`Convocatoria · ${c.edicion}`} titulo={c.titulo} descripcion="Estado de Chihuahua">
        <p className="mt-6 inline-block rounded-md border-2 border-tinta bg-mostaza px-3 py-1 font-mono text-xs uppercase tracking-wider">
          [ {c.estado} ]
        </p>
      </CabeceraPagina>

      <div className="relative bg-arena-100">
        <Fondo patron={c.clave === "omips" ? "karel" : "hex"} tono={c.clave === "omips" ? "medio" : "suave"} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <PanelAviso
            titulo={c.aviso.titulo}
            texto={c.aviso.texto}
            arte={<Trofeo />}
            accion={{ etiqueta: c.aviso.accion, href: "/preregistro" }}
          />

          <div className="mt-16 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
            <article className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-wider text-ladrillo">Convocan</p>
              <p className="mt-2 font-medium">{sitio.convocan}.</p>
              <div className="mt-6 space-y-4 text-lg text-tinta-suave">
                {c.introduccion.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>

              {c.secciones.map((s, i) => (
                <section key={s.titulo} className="mt-12">
                  <h2 className="flex items-baseline gap-3 font-display text-3xl font-bold">
                    <span className="font-mono text-sm font-normal text-ladrillo">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.titulo}
                  </h2>
                  <div className="mt-4 space-y-3 text-tinta-suave">
                    {s.parrafos?.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                    {s.lista && <ListaAscii elementos={s.lista} />}
                  </div>
                </section>
              ))}

              <section className="mt-12">
                <h2 className="font-display text-3xl font-bold">Temario</h2>
                <div className="mt-5 rounded-2xl border-2 border-tinta bg-arena-50 p-6 font-mono text-sm shadow-[4px_4px_0_var(--cafe)]">
                  <p className="text-[11px] uppercase tracking-wider text-ladrillo">&gt; Contenidos</p>
                  <ListaAscii elementos={c.temario.contenidos} />
                  <p className="mt-6 text-[11px] uppercase tracking-wider text-ladrillo">
                    &gt; {c.temario.entorno.titulo}
                  </p>
                  <ListaAscii elementos={c.temario.entorno.lista} />
                </div>
              </section>

              <p className="mt-12 text-tinta-suave">
                Preregistro general para la próxima edición:{" "}
                <a href={`mailto:${sitio.correo}`} className="font-medium text-ladrillo underline underline-offset-4">
                  {sitio.correo}
                </a>
              </p>
            </article>

            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-3xl font-bold">Fechas relevantes</h2>
              <Listado encabezado="Fechas estatales" pagina="001">
                <FilasFechas hitos={c.fechasEstatales} />
              </Listado>
              <Listado encabezado="Fechas nacionales" pagina="002">
                <FilasFechas hitos={c.fechasNacionales} desde={c.fechasEstatales.length + 1} />
              </Listado>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export function ListaAscii({ elementos }: { elementos: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {elementos.map((e) => (
        <li key={e} className="grid grid-cols-[1.5rem_1fr] gap-1">
          <span className="font-mono text-ladrillo" aria-hidden>
            *
          </span>
          <span>{e}</span>
        </li>
      ))}
    </ul>
  );
}
