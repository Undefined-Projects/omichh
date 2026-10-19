import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CabeceraPagina } from "@/app/componentes";
import { db } from "@/lib/db";
import { FormularioEntrenador, type EscuelaCatalogo } from "../formulario-entrenador";

export const metadata: Metadata = {
  title: "Preregistro de entrenador",
  description: "Preregistro de entrenadores y profesores de la OMICHH.",
};

export default function PreregistroEntrenador() {
  return (
    <>
      <CabeceraPagina
        antetitulo="Preregistro · Trámite 01"
        titulo="Preregistro de entrenador / profesor"
        descripcion="Realiza tu preregistro. Validaremos tu información y te contactaremos para activar tu cuenta. Los campos con * son obligatorios."
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Suspense fallback={<p className="font-mono text-sm uppercase tracking-wider text-tinta-suave">Cargando catálogo de escuelas…</p>}>
          <ConCatalogo />
        </Suspense>
      </div>
    </>
  );
}

// El catálogo cambia cuando el comité valida escuelas, así que se lee en cada visita
async function ConCatalogo() {
  await connection();
  const { rows } = await (await db()).execute(
    "SELECT id, nombre, municipio_id FROM escuelas WHERE estado = 'validada' ORDER BY nombre",
  );
  const escuelas: EscuelaCatalogo[] = rows.map((r) => ({
    id: Number(r.id),
    nombre: String(r.nombre),
    municipioId: Number(r.municipio_id),
  }));
  return <FormularioEntrenador escuelas={escuelas} />;
}
