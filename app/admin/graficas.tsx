// Gráficas del panel: HTML y SVG de servidor, sin JavaScript en el navegador.
// Una sola serie por gráfica en naranja; el valor siempre va escrito junto a la
// marca (la identidad no depende del color) y cada una tiene su tabla.

import type { Dato } from "@/lib/datos-admin";

const total = (datos: Dato[]) => datos.reduce((s, d) => s + d.valor, 0);
const pct = (v: number, t: number) => (t ? `${Math.round((v / t) * 100)} %` : "0 %");

export function Tarjeta({
  titulo,
  nota,
  datos,
  className = "",
  children,
}: {
  titulo: string;
  nota?: string;
  datos?: Dato[];
  className?: string;
  children: React.ReactNode;
}) {
  const vacia = datos && total(datos) === 0;
  return (
    <section className={`flex flex-col rounded-2xl border-2 border-tinta bg-arena-50 p-5 shadow-[4px_4px_0_var(--cafe)] ${className}`}>
      <h2 className="font-display text-xl font-bold leading-tight">{titulo}</h2>
      {nota && <p className="mt-1 text-sm text-tinta-suave">{nota}</p>}
      <div className="mt-5 flex-1">
        {vacia ? (
          <p className="py-6 text-center font-mono text-xs uppercase tracking-wider text-tinta-suave">
            Sin datos todavía
          </p>
        ) : (
          children
        )}
      </div>
      {datos && !vacia && <TablaDatos datos={datos} />}
    </section>
  );
}

function TablaDatos({ datos }: { datos: Dato[] }) {
  const t = total(datos);
  return (
    <details className="mt-4 border-t-2 border-dashed border-tinta/15 pt-3">
      <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-tinta-suave hover:text-tinta">
        Ver tabla
      </summary>
      <table className="mt-2 w-full text-sm">
        <tbody>
          {datos.map((d) => (
            <tr key={d.etiqueta} className="odd:bg-papel-banda">
              <td className="px-2 py-1">{d.etiqueta}</td>
              <td className="px-2 py-1 text-right font-mono tabular-nums">{d.valor}</td>
              <td className="px-2 py-1 text-right font-mono tabular-nums text-tinta-suave">{pct(d.valor, t)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

// Globo con el detalle, visible al pasar el cursor o con el foco del teclado
function Globo({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border-2 border-tinta bg-tinta px-2 py-1 font-mono text-[11px] text-arena-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
      {children}
    </span>
  );
}

/* ---------- Barras horizontales: cantidades por categoría ---------- */

export function Barras({ datos }: { datos: Dato[] }) {
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const t = total(datos);
  return (
    <ul className="space-y-2.5">
      {datos.map((d) => (
        <li key={d.etiqueta} tabIndex={0} className="group relative grid grid-cols-[minmax(0,40%)_1fr_2.5rem] items-center gap-3 outline-none">
          <span className="truncate text-sm" title={d.etiqueta}>
            {d.etiqueta}
          </span>
          <span className="relative h-5 rounded-r bg-arena-200/60">
            <span
              className="absolute inset-y-0 left-0 rounded-r-[4px] bg-naranja transition-[filter] group-hover:brightness-110 group-focus:brightness-110"
              style={{ width: `${(d.valor / max) * 100}%` }}
            />
            <Globo>
              {d.etiqueta}: {d.valor} ({pct(d.valor, t)})
            </Globo>
          </span>
          <span className="text-right font-mono text-sm tabular-nums">{d.valor}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Columnas: distribución por edad ---------- */

export function Columnas({ datos, unidad }: { datos: Dato[]; unidad: string }) {
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const t = total(datos);
  return (
    <div>
      <div className="flex h-44 items-end gap-1.5 border-b-2 border-tinta/30">
        {datos.map((d) => (
          <div key={d.etiqueta} tabIndex={0} className="group relative flex h-full flex-1 flex-col justify-end outline-none">
            {d.valor > 0 && (
              <span className="mb-1 text-center font-mono text-[11px] tabular-nums text-tinta-suave">{d.valor}</span>
            )}
            <span
              className="rounded-t-[4px] bg-naranja transition-[filter] group-hover:brightness-110 group-focus:brightness-110"
              style={{ height: `${(d.valor / max) * 80}%` }}
            />
            <Globo>
              {d.etiqueta} {unidad}: {d.valor} ({pct(d.valor, t)})
            </Globo>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {datos.map((d) => (
          <span key={d.etiqueta} className="flex-1 text-center font-mono text-[11px] text-tinta-suave">
            {d.etiqueta}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Línea: preregistros en el tiempo ---------- */

// La línea y las guías van en SVG estirado al ancho; los textos y los puntos van
// en HTML encima, así conservan su tamaño en cualquier pantalla.
export function Linea({ datos }: { datos: Dato[] }) {
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const x = (i: number) => (i / Math.max(datos.length - 1, 1)) * 100;
  const y = (v: number) => (1 - v / max) * 100;
  const guias = [...new Set([0, Math.round(max / 2), max])];
  const ultimo = datos.at(-1);
  return (
    <div className="pl-8">
      <div className="relative h-44">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {guias.map((g) => (
            <line key={g} x1={0} x2={100} y1={y(g)} y2={y(g)} stroke="var(--arena-300)" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
          ))}
          <polyline
            points={datos.map((d, i) => `${x(i)},${y(d.valor)}`).join(" ")}
            fill="none"
            stroke="var(--naranja)"
            strokeWidth={2}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {guias.map((g) => (
          <span key={g} className="absolute -left-8 w-6 -translate-y-1/2 text-right font-mono text-[11px] text-tinta-suave" style={{ top: `${y(g)}%` }}>
            {g}
          </span>
        ))}
        {/* Una franja por semana: zona de cursor más grande que el punto */}
        <div className="absolute inset-0 flex">
          {datos.map((d, i) => (
            <div key={i} tabIndex={0} className="group relative h-full flex-1 outline-none" aria-label={`Semana del ${d.etiqueta}: ${d.valor}`}>
              <span className="absolute inset-y-0 left-1/2 w-px bg-tinta/20 opacity-0 group-hover:opacity-100 group-focus:opacity-100" />
              <span
                className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-arena-50 bg-naranja opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                style={{ top: `${y(d.valor)}%` }}
              />
              <span style={{ top: `${y(d.valor)}%` }} className="absolute left-1/2 -translate-y-6">
                <Globo>
                  Semana del {d.etiqueta}: {d.valor}
                </Globo>
              </span>
            </div>
          ))}
        </div>
        {ultimo && (
          <span className="absolute right-0 -translate-y-7 font-mono text-[11px]" style={{ top: `${y(ultimo.valor)}%` }}>
            {ultimo.valor} esta semana
          </span>
        )}
      </div>
      <div className="relative mt-2 h-4">
        {datos.map((d, i) =>
          i % 4 === 0 ? (
            <span key={i} className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-tinta-suave" style={{ left: `${x(i)}%` }}>
              {d.etiqueta}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

/* ---------- Cifra destacada ---------- */

export function Cifra({ valor, etiqueta, nota }: { valor: number | string; etiqueta: string; nota?: string }) {
  return (
    <div className="rounded-2xl border-2 border-tinta bg-arena-50 p-5 shadow-[4px_4px_0_var(--cafe)]">
      <p className="font-display text-4xl font-bold tabular-nums text-ladrillo">{valor}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider">{etiqueta}</p>
      {nota && <p className="mt-1 text-xs text-tinta-suave">{nota}</p>}
    </div>
  );
}
