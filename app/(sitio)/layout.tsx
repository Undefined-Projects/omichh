import { Encabezado, Pie } from "@/app/componentes";

// Sitio público: encabezado, contenido y pie con el arte ASCII
export default function LayoutSitio({ children }: LayoutProps<"/">) {
  return (
    <>
      <Encabezado />
      <main className="flex-1">{children}</main>
      <Pie />
    </>
  );
}
