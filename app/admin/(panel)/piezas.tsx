// Piezas comunes de las páginas del panel

export function EncabezadoPanel({ titulo, nota, children }: { titulo: string; nota?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ladrillo">
          <span className="franjas-h block h-2.5 w-10 rounded-full" aria-hidden />
          Panel del comité
        </p>
        <h1 className="font-display text-4xl font-bold">{titulo}</h1>
        {nota && <p className="mt-2 text-tinta-suave">{nota}</p>}
      </div>
      {children}
    </div>
  );
}

export function Cargando() {
  return <p className="py-20 text-center font-mono text-sm uppercase tracking-wider text-tinta-suave">Cargando…</p>;
}

export function BotonExportar({ tipo }: { tipo: string }) {
  return (
    <a
      href={`/admin/exportar/${tipo}`}
      className="tecla rounded-xl border-2 border-tinta bg-mostaza px-5 py-2.5 font-mono text-xs uppercase tracking-wider"
    >
      Exportar CSV
    </a>
  );
}

// Tabla con encabezado fijo y desplazamiento horizontal en pantallas chicas
export function Tabla({ columnas, children, vacia }: { columnas: string[]; children: React.ReactNode; vacia?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-tinta bg-arena-50 shadow-[4px_4px_0_var(--cafe)]">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-arena-200 text-left">
          <tr>
            {columnas.map((c) => (
              <th key={c} scope="col" className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] font-normal uppercase tracking-wider text-tinta-suave">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-tinta/15">{children}</tbody>
      </table>
      {vacia && (
        <p className="px-4 py-10 text-center font-mono text-xs uppercase tracking-wider text-tinta-suave">
          *** Sin registros ***
        </p>
      )}
    </div>
  );
}

export const fechaCorta = (sqlite: string) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${sqlite.replace(" ", "T")}Z`),
  );
