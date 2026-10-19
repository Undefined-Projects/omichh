import type { Metadata } from "next";
import Link from "next/link";
import { LogoChihuahua } from "@/app/logo";
import { FormularioEntrar } from "./formulario";

export const metadata: Metadata = { title: "Entrar" };

export default function Entrar() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-16">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-tinta bg-arena-50 shadow-[6px_6px_0_var(--cafe)]">
        <div className="flex items-center gap-3 bg-arena-200 px-7 py-5">
          <LogoChihuahua className="size-11 shrink-0" />
          <div>
            <p className="font-display text-xl font-bold leading-none">OMICHH</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-tinta-suave">Panel del comité</p>
          </div>
        </div>
        <div className="franjas-h h-3" aria-hidden />
        <div className="p-7">
          <FormularioEntrar />
          <Link href="/" className="mt-6 block text-center font-mono text-xs uppercase tracking-wider text-tinta-suave hover:text-tinta">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </main>
  );
}
