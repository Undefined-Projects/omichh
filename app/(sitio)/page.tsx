import {
  competencias,
  convocatorias,
  noticias,
  perfiles,
  preguntas,
  queEsOmichh,
  recursos,
} from "@/lib/contenido";
import {
  ACERTIJO,
  Antena,
  ArteAscii,
  CampoBits,
  COMPUTADORA,
  KAREL,
  SignoPregunta,
  Teclado,
  Trofeo,
} from "@/app/arte-ascii";
import { Boton, Cartucho, Enlace, Fondo, Listado, PanelAviso, Titulo } from "@/app/componentes";

const ARTE_COMPETENCIA: Record<string, string[]> = {
  OMI: COMPUTADORA,
  OMIPS: KAREL,
  Bebras: ACERTIJO,
};

export default function Inicio() {
  return (
    <>
      <Portada />
      <QueEs />
      <Competencias />
      <Convocatorias />
      <Preparate />
      <Noticias />
      <Preguntas />
    </>
  );
}

function Portada() {
  return (
    <section className="relative overflow-hidden bg-arena-100">
      <ArteAscii />
      <div className="relative mx-auto max-w-6xl px-4 pb-[32.75rem] pt-14 sm:px-6 sm:pb-[43.5rem] sm:pt-20 lg:pb-[16rem]">
        <div className="max-w-xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-md border-2 border-tinta bg-arena-50 px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
            <span className="size-2 rounded-full bg-naranja" />
            Delegación Chihuahua · Fase estatal
          </p>
          <h1 className="font-display text-[2.6rem] font-bold leading-[0.98] tracking-tight text-balance sm:text-7xl">
            Olimpiada Mexicana de Informática en{" "}
            <span className="text-ladrillo italic">Chihuahua</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-tinta-suave text-pretty">
            La OMICHH es la fase estatal de la competencia nacional de
            programación. Buscamos a los mejores talentos de Chihuahua en
            resolución de problemas computacionales, quienes representarán al
            estado en la Olimpiada Mexicana de Informática.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Boton href="/preregistro">Preregístrate</Boton>
            <Boton href="#convocatorias" variante="mostaza">
              Ver convocatorias
            </Boton>
          </div>
        </div>
      </div>
    </section>
  );
}

function QueEs() {
  return (
    <section className="relative overflow-hidden bg-arena-100">
      <Fondo patron="circuito" className="opacity-60" deriva="izquierda" barrido="t2" />
      <CampoBits />
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Titulo id="que-es" numero="01" antetitulo="La olimpiada">
          ¿Qué es la OMICHH?
        </Titulo>
        <div className="lg:pt-10">
          <p className="text-lg text-tinta-suave">{queEsOmichh}</p>
          <Enlace
            href="/que-es-la-omi"
            className="mt-6 inline-block font-mono text-xs uppercase tracking-wider text-ladrillo hover:text-tinta"
          >
            ¿Qué es la OMI? →
          </Enlace>
        </div>
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 pb-24 sm:px-6 md:grid-cols-2">
        {perfiles.map((p) => (
          <div
            key={p.titulo}
            className="flex flex-col rounded-2xl border-2 border-tinta bg-arena-50 p-7 shadow-[4px_4px_0_var(--cafe)]"
          >
            <h3 className="font-display text-2xl font-bold">{p.titulo}</h3>
            <p className="mt-3 flex-1 text-tinta-suave">{p.texto}</p>
            <Enlace
              href={p.accion.href}
              className="mt-5 font-mono text-xs uppercase tracking-wider text-ladrillo hover:text-tinta"
            >
              {p.accion.etiqueta} →
            </Enlace>
          </div>
        ))}
      </div>
    </section>
  );
}

function Competencias() {
  return (
    <section className="relative overflow-hidden border-y-2 border-tinta bg-arena-50 py-24">
      <Fondo patron="perforada" tono="suave" className="opacity-70" deriva="arriba" velocidad="lenta" barrido="t1" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Titulo id="competencias" numero="02" antetitulo="Las competencias">
          Hay un lugar para ti, desde primaria hasta preparatoria
        </Titulo>
        <div className="grid gap-8 lg:grid-cols-3">
          {competencias.map((c, i) => (
            <Cartucho key={c.siglas} competencia={c} numero={i + 1} arte={ARTE_COMPETENCIA[c.siglas]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Convocatorias() {
  return (
    <section className="relative overflow-hidden bg-arena-100">
      <Fondo patron="rejilla" deriva="diagonal" velocidad="lenta" barrido="t3" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Titulo id="convocatorias" numero="03" antetitulo="Convocatorias">
          Convocatorias 2026
        </Titulo>
        <div className="grid gap-8 lg:grid-cols-2">
          {Object.values(convocatorias).map((c) => (
            <Listado key={c.clave} encabezado={`OMICHH · ${c.siglas} 2026`}>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-[11px] uppercase tracking-wider text-naranja">
                  [ {c.estado} ] · {c.edicion}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-balance">{c.titulo}</h3>
                <p className="mt-2 font-sans text-tinta-suave">{c.resumen}</p>
              </div>
              <ul>
                {c.hitos.map((h) => (
                  <li key={h} className="px-4 py-2.5 text-sm uppercase tracking-wider odd:bg-papel-banda sm:px-6">
                    <span className="text-ladrillo">[✓]</span> {h}
                  </li>
                ))}
              </ul>
              <div className="px-4 py-4 sm:px-6">
                <Enlace
                  href={`/convocatoria/${c.clave}`}
                  className="text-xs uppercase tracking-wider text-ladrillo hover:text-tinta"
                >
                  Ver convocatoria completa →
                </Enlace>
              </div>
            </Listado>
          ))}
        </div>

        <div className="mt-12">
          <PanelAviso
            titulo="Preregistro en línea abierto"
            texto="Profesores, entrenadores y estudiantes: regístrate, revisaremos tu información y te contactaremos con los siguientes pasos. Los entrenadores validados podrán dar de alta a sus alumnos."
            arte={<Trofeo />}
            accion={{ etiqueta: "Ir al preregistro", href: "/preregistro" }}
          />
        </div>
      </div>
    </section>
  );
}

function Preparate() {
  return (
    <section className="relative overflow-hidden border-y-2 border-tinta bg-arena-200 py-24">
      <Teclado />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Titulo id="preparate" numero="04" antetitulo="Prepárate">
          Las herramientas de la olimpiada
        </Titulo>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recursos.map((r, i) => (
            <a
              key={r.nombre}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="tecla group flex flex-col rounded-2xl border-2 border-tinta bg-arena-50 p-6 hover:bg-arena-100"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-ladrillo">F{i + 1}</span>
              <span className="mt-2 font-display text-2xl font-bold">{r.nombre}</span>
              <span className="mt-2 flex-1 text-sm text-tinta-suave">{r.descripcion}</span>
              <span className="mt-5 font-mono text-xs uppercase tracking-wider text-ladrillo">
                Abrir <span className="inline-block transition group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Noticias() {
  return (
    <section className="relative overflow-hidden border-t-2 border-tinta bg-arena-100">
      <Fondo patron="ondas" deriva="derecha" velocidad="rapida" barrido="t0" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex items-end justify-between gap-8">
          <Titulo id="noticias" numero="05" antetitulo="Noticias">
            Lo más reciente de la olimpiada
          </Titulo>
          <div className="mb-12">
            <Antena />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {noticias.map((n) => (
            <article key={n.titulo}>
              <div className="franjas-h h-1.5 rounded-full" aria-hidden />
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-tinta-suave">{n.fecha}</p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-balance">{n.titulo}</h3>
              <p className="mt-2 text-tinta-suave">{n.resumen}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preguntas() {
  return (
    <section className="relative overflow-hidden border-t-2 border-tinta bg-arena-50 py-24">
      <Fondo patron="hex" tono="suave" className="opacity-60" deriva="arriba" barrido="t4" />
      <div className="relative mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
        <div>
          <Titulo id="preguntas" numero="06" antetitulo="Preguntas frecuentes">
            ¿Tienes dudas?
          </Titulo>
          <SignoPregunta />
        </div>
        <div className="space-y-4">
          {preguntas.map((p) => (
            <details
              key={p.pregunta}
              className="group rounded-2xl border-2 border-tinta bg-arena-100 px-5 py-4 open:shadow-[4px_4px_0_var(--cafe)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {p.pregunta}
                <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-tinta bg-mostaza font-mono text-sm transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-10 text-tinta-suave">{p.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
