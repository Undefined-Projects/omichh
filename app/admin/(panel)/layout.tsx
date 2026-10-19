import Link from "next/link";
import { Suspense } from "react";
import { LogoChihuahua } from "@/app/logo";
import { salir } from "@/lib/acciones-admin";
import { adminActual } from "@/lib/sesion";

const SECCIONES = [
  { href: "/admin", etiqueta: "Resumen" },
  { href: "/admin/competidores", etiqueta: "Competidores" },
  { href: "/admin/entrenadores", etiqueta: "Entrenadores" },
  { href: "/admin/escuelas", etiqueta: "Escuelas" },
];

export default function LayoutPanel({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="sticky top-0 z-30 bg-arena-100/[0.97]">
        <div className="franjas-h h-1.5" aria-hidden />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-tinta/10 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoChihuahua className="size-9 shrink-0" />
            <span className="leading-none">
              <span className="block font-display text-lg font-bold">OMICHH</span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-tinta-suave">Panel del comité</span>
            </span>
          </Link>
          <nav className="order-last flex w-full gap-1 overflow-x-auto font-mono text-xs uppercase tracking-wider md:order-none md:w-auto">
            {SECCIONES.map((s) => (
              <Link key={s.href} href={s.href} className="shrink-0 rounded-md px-3 py-2 text-tinta-suave hover:bg-mostaza/30 hover:text-tinta">
                {s.etiqueta}
              </Link>
            ))}
          </nav>
          <Suspense fallback={<span className="h-8 w-32" />}>
            <Usuario />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </>
  );
}

async function Usuario() {
  const admin = await adminActual();
  if (!admin) return null;
  return (
    <form action={salir} className="flex items-center gap-3">
      <span className="hidden text-right text-sm leading-tight sm:block">
        {admin.nombre}
        <span className="block font-mono text-[10px] text-tinta-suave">{admin.correo}</span>
      </span>
      <button type="submit" className="tecla rounded-lg border-2 border-tinta bg-arena-50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider">
        Salir
      </button>
    </form>
  );
}
