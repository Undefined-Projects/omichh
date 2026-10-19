"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Menú desplegable para pantallas sin la navegación completa. Se cierra solo
// al cambiar de página, porque el encabezado persiste entre navegaciones.
export function MenuMovil({ children }: { children: React.ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const ruta = usePathname();

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [ruta]);

  return (
    <details ref={menu} className="relative xl:hidden">
      <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border-2 border-tinta [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Menú</span>
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </summary>
      <nav className="absolute right-0 mt-3 flex w-60 flex-col rounded-xl border-2 border-tinta bg-arena-50 p-2 font-mono text-xs uppercase tracking-wider shadow-[4px_4px_0_var(--cafe)]">
        {children}
      </nav>
    </details>
  );
}
