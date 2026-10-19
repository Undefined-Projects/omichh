import type { Metadata } from "next";
import { CabeceraPagina } from "@/app/componentes";
import { FormularioCompetidor } from "../formulario-competidor";

export const metadata: Metadata = {
  title: "Preregistro de competidor",
  description: "Preregistro de estudiantes interesados en la OMI, la OMIPS y Bebras en Chihuahua.",
};

export default function PreregistroCompetidor() {
  return (
    <>
      <CabeceraPagina
        antetitulo="Preregistro · Trámite 02"
        titulo="Preregistro de competidor"
        descripcion="Este preregistro es para estudiantes interesados que todavía no tienen entrenador, profesor o asesor. Si ya tienes uno, contáctalo directamente para que complete tu registro oficial."
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <p className="mb-8 rounded-2xl border-2 border-dashed border-tinta/30 bg-arena-50 p-5 text-tinta-suave">
          La convocatoria OMI 2026 ya cerró. El preregistro en este sitio permanece abierto: las nuevas solicitudes se
          considerarán para las siguientes convocatorias. Si necesitas apoyo para ubicar o contactar a un entrenador,
          escríbenos a{" "}
          <a href="mailto:olimpiadainformaticachihuahua@gmail.com" className="font-medium text-ladrillo underline underline-offset-4">
            olimpiadainformaticachihuahua@gmail.com
          </a>
          .
        </p>
        <FormularioCompetidor />
      </div>
    </>
  );
}
