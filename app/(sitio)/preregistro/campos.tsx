// Piezas de formulario con el estilo del sitio (bordes gruesos, etiquetas en mono)

import Link from "next/link";

export const estiloControl =
  "w-full rounded-lg border-2 border-tinta bg-arena-50 px-3 py-2.5 text-base text-tinta outline-none transition placeholder:text-tinta-suave/60 focus:border-naranja focus:ring-4 focus:ring-mostaza/30 aria-[invalid=true]:border-ladrillo";

export function Campo({
  nombre,
  etiqueta,
  ayuda,
  error,
  requerido,
  children,
  className = "",
}: {
  nombre: string;
  etiqueta: string;
  ayuda?: string;
  error?: string;
  requerido?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={nombre} className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
        {etiqueta}
        {requerido && <span className="text-ladrillo"> *</span>}
      </label>
      {children}
      {ayuda && !error && <p className="mt-1.5 text-xs text-tinta-suave">{ayuda}</p>}
      {error && (
        <p id={`${nombre}-error`} className="mt-1.5 text-sm text-ladrillo">
          {error}
        </p>
      )}
    </div>
  );
}

// Atributos de accesibilidad para un control con posible error
export const aria = (nombre: string, errores?: Record<string, string>) => ({
  id: nombre,
  name: nombre,
  "aria-invalid": errores?.[nombre] ? true : undefined,
  "aria-describedby": errores?.[nombre] ? `${nombre}-error` : undefined,
});

export function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border-2 border-tinta bg-arena-100 p-6 shadow-[4px_4px_0_var(--cafe)] sm:p-8">
      <legend className="rounded-md border-2 border-tinta bg-mostaza px-3 py-1 font-mono text-xs uppercase tracking-wider">
        {titulo}
      </legend>
      <div className="mt-2 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

// Campo trampa del formulario anterior: invisible para personas
export function Trampa() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="sitio_web">Sitio web (no llenar)</label>
      <input id="sitio_web" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function AvisoPrivacidad({ error }: { error?: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-tinta/30 bg-arena-50 p-5">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="aviso_privacidad"
          value="1"
          required
          className="mt-1 size-5 shrink-0 accent-naranja"
          aria-invalid={error ? true : undefined}
        />
        <span className="text-tinta-suave">
          He leído y acepto el{" "}
          <Link href="/aviso-de-privacidad" target="_blank" className="font-medium text-ladrillo underline underline-offset-4">
            aviso de privacidad
          </Link>{" "}
          y autorizo el tratamiento de mis datos con fines de organización de la OMICHH.
        </span>
      </label>
      {error && <p className="mt-2 text-sm text-ladrillo">{error}</p>}
    </div>
  );
}

export function Enviar({ pendiente }: { pendiente: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        disabled={pendiente}
        className="tecla rounded-xl border-2 border-tinta bg-naranja px-7 py-3 font-mono text-sm uppercase tracking-wider text-arena-50 disabled:opacity-60"
      >
        {pendiente ? "Enviando…" : "Enviar preregistro"}
      </button>
      <Link href="/preregistro" className="font-mono text-xs uppercase tracking-wider text-tinta-suave hover:text-tinta">
        Cancelar
      </Link>
    </div>
  );
}

export function Exito({ mensaje }: { mensaje: string }) {
  return (
    <div role="status" className="flex overflow-hidden rounded-3xl border-2 border-tinta bg-cafe text-arena-100 shadow-[6px_6px_0_var(--tinta)]">
      <div className="franjas w-3 shrink-0 sm:w-4" aria-hidden />
      <div className="p-7 sm:p-9">
        <p className="font-mono text-xs uppercase tracking-wider text-mostaza">[✓] Preregistro enviado</p>
        <p className="mt-2 font-display text-3xl font-bold text-balance">¡Gracias!</p>
        <p className="mt-3 max-w-xl text-arena-300">{mensaje}</p>
        <Link
          href="/"
          className="tecla mt-6 inline-block rounded-xl border-2 border-tinta bg-mostaza px-6 py-3 font-mono text-sm uppercase tracking-wider text-tinta"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
