import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Fraunces (OFL) instanciada a la medida: peso 700, SOFT 100 y WONK 1 fijos,
// con el tamaño óptico (opsz) aún variable. Pesa 33 KB en vez de 121 KB.
// Se generó con fontTools desde el subconjunto latino de Google Fonts.
const fraunces = localFont({
  src: "./fuentes/fraunces-omichh.woff2",
  variable: "--font-fraunces",
  weight: "700",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: {
    default: "Olimpiada Mexicana de Informática en Chihuahua · OMICHH",
    template: "%s · OMICHH",
  },
  description:
    "La OMICHH es la fase estatal de la Olimpiada Mexicana de Informática en Chihuahua: convocatorias OMI y OMIPS, Bebras, preregistro, entrenadores y delegación.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${plexSans.variable} ${plexMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
