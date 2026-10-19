import type { Metadata } from "next";
import { convocatorias } from "@/lib/contenido";
import { PaginaConvocatoria } from "@/app/(sitio)/convocatoria/pagina-convocatoria";

export const metadata: Metadata = {
  title: "Convocatoria OMI 2026",
  description: convocatorias.omi.resumen,
};

export default function ConvocatoriaOMI() {
  return <PaginaConvocatoria convocatoria={convocatorias.omi} />;
}
