import { useId } from "react";

// Silueta del estado de Chihuahua (geojson público angelnmara/geojson, simplificada)
// pintada como el sol setentero: degradado mostaza → ladrillo con franjas.
export const SILUETA_CHIHUAHUA =
  "M88.4 44.8L87.2 47.1L88.3 47.8L87.8 48.7L87.0 48.7L86.0 50.9L84.4 51.8L83.1 53.9L82.8 54.5L83.3 55.3L81.3 59.8L80.0 59.6L80.0 60.5L80.6 60.6L80.9 61.4L79.7 61.8L80.2 64.4L79.6 65.0L80.1 67.5L80.7 67.8L80.9 68.8L81.1 74.1L82.4 75.0L82.2 75.8L80.0 76.8L80.1 78.1L81.9 80.1L80.0 79.6L78.3 80.2L77.4 79.9L77.0 80.3L74.3 79.0L73.7 79.6L74.8 80.0L74.8 80.6L73.4 80.8L72.0 81.9L71.0 83.7L70.9 84.8L68.8 85.4L66.3 83.5L64.9 83.7L63.9 83.1L62.4 84.4L61.9 84.1L61.2 84.7L59.3 84.2L58.8 83.3L57.8 83.3L56.0 82.0L54.9 81.8L53.6 80.0L50.9 78.7L50.4 79.7L49.4 80.0L48.1 84.9L48.8 85.5L48.8 86.1L47.1 87.4L47.1 88.1L46.3 88.2L46.5 89.4L46.0 89.6L45.1 91.8L45.9 93.8L44.8 95.7L42.4 98.0L40.1 96.6L39.2 96.7L38.5 95.6L37.0 96.4L35.9 94.9L35.6 93.0L34.0 90.3L28.9 89.1L28.2 86.5L26.5 83.7L26.3 82.4L25.7 82.1L25.8 78.7L25.2 77.4L24.2 77.4L24.1 75.8L20.1 75.5L19.0 75.8L17.1 74.8L17.5 74.3L17.3 72.4L17.9 69.7L16.2 65.5L14.4 64.2L14.5 62.0L13.4 60.3L12.2 59.6L12.5 58.0L11.6 57.1L12.1 56.4L14.3 55.6L16.0 56.4L18.4 55.0L18.7 54.4L17.5 53.9L16.6 52.9L16.9 51.3L16.4 50.3L17.2 48.1L17.1 44.7L17.9 44.1L18.0 42.6L18.9 41.9L18.7 38.9L19.2 36.5L18.8 32.8L18.0 32.0L19.0 27.4L18.2 26.7L18.7 24.9L17.7 20.9L17.1 20.1L17.4 18.9L16.9 18.4L16.8 17.1L15.3 15.6L16.2 15.3L16.5 13.6L15.1 10.2L15.7 9.6L15.1 9.0L22.8 9.0L22.8 2.0L45.6 2.0L46.2 2.6L47.0 2.5L50.0 7.0L53.4 8.5L55.9 11.5L58.3 12.9L58.9 14.3L60.8 15.7L61.0 16.4L64.9 18.1L67.8 20.9L68.4 23.7L70.4 26.0L70.8 31.2L72.0 32.7L72.8 34.8L74.9 36.8L76.4 37.2L77.8 39.1L79.3 40.1L83.1 41.3L84.8 42.7L86.1 42.7Z";

// Franjas que empiezan delgadas y se ensanchan hacia abajo, como en el sol de
// la portada; recorren la mitad inferior del estado hasta cerca de la punta.
export const FRANJAS_SOL = [
  { y: 50, alto: 1.8 },
  { y: 59, alto: 2.6 },
  { y: 68, alto: 3.5 },
  { y: 77, alto: 4.5 },
  { y: 86, alto: 5.5 },
];

export function LogoChihuahua({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-sol`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--mostaza)" />
          <stop offset="0.55" stopColor="var(--naranja)" />
          <stop offset="1" stopColor="var(--ladrillo)" />
        </linearGradient>
        <mask id={`${id}-franjas`}>
          <rect width="100" height="100" fill="white" />
          {FRANJAS_SOL.map((f) => (
            <rect key={f.y} y={f.y} width="100" height={f.alto} fill="black" />
          ))}
        </mask>
      </defs>
      <path
        d={SILUETA_CHIHUAHUA}
        fill={`url(#${id}-sol)`}
        mask={`url(#${id}-franjas)`}
        stroke="var(--tinta)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
