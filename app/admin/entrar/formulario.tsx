"use client";

import { useActionState } from "react";
import { entrar } from "@/lib/acciones-admin";
import { estiloControl } from "@/app/(sitio)/preregistro/campos";

export function FormularioEntrar() {
  const [estado, accion, pendiente] = useActionState(entrar, {});
  return (
    <form action={accion} className="space-y-5">
      {estado.error && (
        <p role="alert" className="rounded-xl border-2 border-ladrillo bg-arena-50 px-4 py-3 text-sm text-ladrillo">
          {estado.error}
        </p>
      )}
      <div>
        <label htmlFor="correo" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
          Correo electrónico
        </label>
        <input id="correo" name="correo" type="email" autoComplete="username" required className={estiloControl} />
      </div>
      <div>
        <label htmlFor="contrasena" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
          Contraseña
        </label>
        <input id="contrasena" name="contrasena" type="password" autoComplete="current-password" required className={estiloControl} />
      </div>
      <button
        type="submit"
        disabled={pendiente}
        className="tecla w-full rounded-xl border-2 border-tinta bg-tinta px-6 py-3 font-mono text-sm uppercase tracking-wider text-arena-50 disabled:opacity-60"
      >
        {pendiente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
