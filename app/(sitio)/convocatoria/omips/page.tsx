import type { Metadata } from "next";
import { convocatorias } from "@/lib/contenido";
import { PaginaConvocatoria } from "@/app/(sitio)/convocatoria/pagina-convocatoria";

export const metadata: Metadata = {
  title: "Convocatoria OMIPS 2026",
  description: convocatorias.omips.resumen,
};

export default function ConvocatoriaOMIPS() {
  return <PaginaConvocatoria convocatoria={convocatorias.omips} />;
}
