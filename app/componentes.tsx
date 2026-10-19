import Link from "next/link";
import type { Competencia, Hito } from "@/lib/contenido";
import { enlacesPlataforma, navegacion, sitio } from "@/lib/contenido";
import { DunasPie, Ilustracion, PaisajeCabecera, Rotulo } from "./arte-ascii";
import { LogoChihuahua } from "./logo";
import { MenuMovil } from "./menu-movil";

/* ---------- Enlaces y botones ---------- */

export function Enlace({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (/^(https?:|mailto:)/.test(href)) {
    const externo = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        {...(externo ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const estilosBoton = {
  tinta: "bg-tinta text-arena-50",
  mostaza: "bg-mostaza text-tinta",
  naranja: "bg-naranja text-arena-50",
  claro: "bg-arena-50 text-tinta",
};

export function Boton({
  href,
  variante = "tinta",
  children,
}: {
  href: string;
  variante?: keyof typeof estilosBoton;
  children: React.ReactNode;
}) {
  return (
    <Enlace
      href={href}
      className={`tecla inline-block rounded-xl border-2 border-tinta px-6 py-3 font-mono text-sm uppercase tracking-wider ${estilosBoton[variante]}`}
    >
      {children}
    </Enlace>
  );
}

/* ---------- Fondos ASCII ---------- */

const MOSAICOS = {
  circuito: "mosaico-circuito",
  perforada: "mosaico-perforada",
  rejilla: "mosaico-rejilla",
  ondas: "mosaico-ondas",
  hex: "mosaico-hex",
  cielo: "mosaico-cielo",
  karel: "mosaico-karel",
  acertijos: "mosaico-acertijos",
};

// suave para fondos claros o detrás de mucho texto; medio para fondos arena-200
const TONOS = {
  suave: "[--tono-fondo:var(--arena-200)]",
  medio: "[--tono-fondo:var(--arena-300)]",
};

const DIRECCIONES = {
  izquierda: "hacia-izquierda",
  derecha: "hacia-derecha",
  arriba: "hacia-arriba",
  diagonal: "hacia-diagonal",
};

const VELOCIDADES = {
  lenta: "[--vel:120s]",
  media: "[--vel:80s]",
  rapida: "[--vel:45s]",
};

// Retraso del primer barrido de cada sección, escalonado y después de la carga
const RETRASOS_BARRIDO = {
  t0: "[--retraso-barrido:1.5s]",
  t1: "[--retraso-barrido:2.7s]",
  t2: "[--retraso-barrido:3.9s]",
  t3: "[--retraso-barrido:5.1s]",
  t4: "[--retraso-barrido:6.3s]",
  t5: "[--retraso-barrido:7.5s]",
};

export function Fondo({
  patron,
  tono = "medio",
  className = "",
  deriva,
  velocidad = "media",
  barrido,
}: {
  patron: keyof typeof MOSAICOS;
  tono?: keyof typeof TONOS;
  className?: string;
  // Animación de la página principal: el mosaico avanza y, si se pide, lo cruza una franja de luz
  deriva?: keyof typeof DIRECCIONES;
  velocidad?: keyof typeof VELOCIDADES;
  barrido?: keyof typeof RETRASOS_BARRIDO;
}) {
  const movimiento = deriva ? `deriva ${DIRECCIONES[deriva]} ${VELOCIDADES[velocidad]}` : "";
  return (
    <div aria-hidden className={`fondo-ascii ${MOSAICOS[patron]} ${movimiento} ${TONOS[tono]} ${className}`}>
      {barrido && <div className={`barrido ${RETRASOS_BARRIDO[barrido]}`} />}
    </div>
  );
}

/* ---------- Encabezado y pie ---------- */

export function Logotipo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <LogoChihuahua className="size-11 shrink-0" />
      <span className="leading-none">
        <span className="block font-display text-xl font-bold">{sitio.siglas}</span>
        <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-tinta-suave sm:block">
          Informática · Chihuahua
        </span>
      </span>
    </Link>
  );
}

export function Encabezado() {
  return (
    <header className="sticky top-0 z-30 bg-arena-100/[0.97]">
      <div className="franjas-h h-1.5" aria-hidden />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 border-b-2 border-tinta/10 px-4 sm:px-6">
        <Logotipo />
        <nav className="hidden items-center gap-5 font-mono text-xs uppercase tracking-wider text-tinta-suave xl:flex">
          {navegacion.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ladrillo">
              {n.etiqueta}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/preregistro"
            className="tecla rounded-lg border-2 border-tinta bg-naranja px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-arena-50"
          >
            Preregístrate
          </Link>
          <MenuMovil>
            {[{ href: "/", etiqueta: "Inicio" }, ...navegacion].map((n) => (
              <Link key={n.href} href={n.href} className="rounded-md px-3 py-2.5 hover:bg-mostaza/30">
                {n.etiqueta}
              </Link>
            ))}
          </MenuMovil>
        </div>
      </div>
    </header>
  );
}

export async function Pie() {
  "use cache";
  return (
    <footer className="relative overflow-hidden bg-arena-200">
      <div className="space-y-1.5 bg-arena-100 pb-1.5" aria-hidden>
        <div className="h-2 bg-mostaza" />
        <div className="h-2 bg-naranja" />
        <div className="h-2 bg-ladrillo" />
        <div className="h-2 bg-cafe" />
      </div>
      <Fondo patron="cielo" className="top-14 bottom-40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-44 pt-14 sm:px-6 sm:pb-52 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="sr-only">{sitio.siglas}</p>
          <Rotulo />
          <p className="mt-6 max-w-sm text-sm text-tinta-suave">
            {sitio.nombre}. Convocan: {sitio.convocan}.
          </p>
        </div>
        <nav className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-tinta-suave">
          <span className="mb-1 text-ladrillo">Secciones</span>
          {navegacion.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-tinta">
              {n.etiqueta}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-tinta-suave">
          <span className="mb-1 text-ladrillo">Contacto</span>
          <a href={`mailto:${sitio.correo}`} className="normal-case tracking-normal text-tinta [overflow-wrap:anywhere] hover:text-ladrillo">
            {sitio.correo.split("@")[0]}
            <wbr />@{sitio.correo.split("@")[1]}
          </a>
          <a href={`https://wa.me/${sitio.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-tinta">
            WhatsApp {sitio.whatsappVisible}
          </a>
          <Link href="/aviso-de-privacidad" className="hover:text-tinta">
            Aviso de privacidad
          </Link>
          <Link href={enlacesPlataforma.acceder} className="hover:text-tinta">
            Acceso del comité →
          </Link>
          <p className="mt-4">© {new Date().getFullYear()} {sitio.siglas} · Hecho en Chihuahua</p>
          <div className="mt-5">
            <p>Página creada por</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- logo pequeño ya optimizado */}
            <img
              src="/undefined-projects.webp"
              alt="Undefined Projects"
              width={188}
              height={32}
              loading="lazy"
              className="mt-2 h-8 w-auto"
            />
          </div>
        </div>
      </div>
      <DunasPie />
    </footer>
  );
}

/* ---------- Títulos y cabeceras ---------- */

export function Titulo({
  id,
  numero,
  antetitulo,
  children,
}: {
  id?: string;
  numero?: string;
  antetitulo: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mb-12 max-w-2xl">
      <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ladrillo">
        <span className="franjas-h block h-2.5 w-10 rounded-full" aria-hidden />
        {numero ? `${numero} — ${antetitulo}` : antetitulo}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance sm:text-5xl">
        {children}
      </h2>
    </div>
  );
}

export function CabeceraPagina({
  antetitulo,
  titulo,
  descripcion,
  children,
}: {
  antetitulo: string;
  titulo: React.ReactNode;
  descripcion?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-tinta bg-arena-100">
      <PaisajeCabecera />
      <div className="relative mx-auto max-w-6xl px-4 pb-[13rem] pt-14 sm:px-6 sm:pb-[15rem] sm:pt-20">
        <p className="mb-6 inline-flex items-center gap-2 rounded-md border-2 border-tinta bg-arena-50 px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
          <span className="size-2 rounded-full bg-naranja" />
          {antetitulo}
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl">
          {titulo}
        </h1>
        {descripcion && (
          <p className="mt-6 max-w-2xl text-lg text-tinta-suave text-pretty">{descripcion}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------- Bloques ---------- */

export function PanelAviso({
  titulo,
  texto,
  accion,
  arte,
}: {
  titulo: string;
  texto: string;
  accion?: { etiqueta: string; href: string };
  arte?: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden rounded-3xl border-2 border-tinta bg-cafe text-arena-100 shadow-[6px_6px_0_var(--tinta)]">
      <div className="franjas w-3 shrink-0 sm:w-4" aria-hidden />
      <div className="flex flex-1 flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center sm:p-9">
        <div className="max-w-xl">
          <p className="font-display text-3xl font-bold text-balance">{titulo}</p>
          <p className="mt-2 text-arena-300">{texto}</p>
        </div>
        {arte}
        {accion && (
          <Boton href={accion.href} variante="mostaza">
            {accion.etiqueta}
          </Boton>
        )}
      </div>
    </div>
  );
}

export function Cartucho({
  competencia,
  numero,
  arte,
}: {
  competencia: Competencia;
  numero: number;
  arte: string[];
}) {
  const c = competencia;
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border-2 border-tinta bg-arena-100 shadow-[6px_6px_0_var(--cafe)]">
      <div className="flex items-end justify-between gap-4 bg-arena-200 px-7 pb-3 pt-5">
        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
            Cartucho {String(numero).padStart(2, "0")}
          </span>
          <span className="mt-1 block font-display text-5xl font-bold leading-none text-ladrillo">
            {c.siglas}
          </span>
        </div>
        <Ilustracion lineas={arte} />
      </div>
      <div className="franjas-h h-3" aria-hidden />
      <div className="flex flex-1 flex-col p-7">
        <span className="self-start rounded-md border-2 border-tinta/20 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
          {c.nivel}
        </span>
        <h3 className="mt-4 text-lg font-semibold">{c.nombre}</h3>
        <p className="mt-2 flex-1 text-tinta-suave">{c.descripcion}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
            [ {c.estado} ]
          </span>
          <Enlace href={c.href} className="font-mono text-xs uppercase tracking-wider text-ladrillo hover:text-tinta">
            {c.accion} →
          </Enlace>
        </div>
      </div>
    </article>
  );
}

/* Hoja de papel continuo de impresora */
export function Listado({
  encabezado,
  pagina = "001",
  children,
}: {
  encabezado: string;
  pagina?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden rounded-sm border-2 border-tinta/25 bg-arena-50 shadow-[0_10px_30px_-12px_rgb(91_58_36_/_0.35)]">
      <div className="perforaciones w-6 shrink-0 border-r-2 border-dashed border-tinta/15 sm:w-8" aria-hidden />
      <div className="min-w-0 flex-1 font-mono">
        <div className="flex justify-between gap-4 border-b-2 border-dashed border-tinta/15 px-4 py-3 text-[11px] uppercase tracking-wider text-tinta-suave sm:px-6">
          <span>{encabezado}</span>
          <span className="shrink-0">PAG. {pagina}</span>
        </div>
        {children}
        <p className="border-t-2 border-dashed border-tinta/15 px-4 py-3 text-[11px] uppercase tracking-wider text-tinta-suave sm:px-6">
          *** FIN DEL LISTADO ***
        </p>
      </div>
      <div className="perforaciones w-6 shrink-0 border-l-2 border-dashed border-tinta/15 sm:w-8" aria-hidden />
    </div>
  );
}

export function FilasFechas({ hitos, desde = 1 }: { hitos: Hito[]; desde?: number }) {
  return (
    <ol>
      {hitos.map((h, i) => (
        <li
          key={h.titulo}
          className="grid gap-x-5 gap-y-1 px-4 py-4 odd:bg-papel-banda sm:grid-cols-[2.5rem_1fr] sm:px-6"
        >
          <span className="text-sm text-ladrillo">{String(desde + i).padStart(2, "0")}</span>
          <div>
            <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-sm font-medium uppercase tracking-wider">{h.titulo}</span>
              <span className="text-xs uppercase tracking-wider text-tinta-suave">[ {h.fecha} ]</span>
            </p>
            <p className="mt-1 font-sans text-sm text-tinta-suave">{h.detalle}</p>
            <p className={`mt-2 text-[11px] uppercase tracking-wider ${h.realizado ? "text-tinta-suave" : "text-naranja"}`}>
              {h.realizado ? "[✓] Realizado" : "[ ] Pendiente"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
