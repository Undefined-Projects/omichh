// Arte ASCII de todo el sitio. Todo se genera en el servidor, es decorativo
// (aria-hidden) y usa ruido determinista para verse igual en cada build.
//
// Rendimiento: el dibujo base es un <pre> estático que se pinta una sola vez.
// Lo que se anima (estrellas, sol, bits, teclas, ondas) va en capas encima,
// agrupadas por animación; cada capa solo anima opacity o transform, que el
// navegador resuelve en la GPU sin volver a pintar el dibujo.

type Celda = [string, string]; // [carácter, clase de color]

// Carácter suelto en una capa animada, en coordenadas de la retícula
type Punto = { x: number; y: number; c: string; color: string; grupo: string };

// Región compacta animada como un solo bloque (p. ej. el sol)
type Bloque = { x: number; y: number; celdas: Celda[][]; grupo: string };

// Las celdas de una fuente monoespaciada son ~0.6 veces más anchas que altas
const ASPECTO = 1.67;

function ruido(x: number, y: number) {
  let h = Math.imul(x * 374761393 + y * 668265263, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function elegir(texto: string, x: number, y: number) {
  return texto[Math.floor(ruido(x, y) * texto.length)];
}

// Variante de animación (t0–t5 en globals.css) para desfasar cada capa
function variante(x: number, y: number) {
  return `t${Math.floor(ruido(x + 31, y + 17) * 6)}`;
}

function lienzo(columnas: number, filas: number, celda: (x: number, y: number) => Celda) {
  return Array.from({ length: filas }, (_, y) =>
    Array.from({ length: columnas }, (_, x) => celda(x, y)),
  );
}

function estampar(destino: Celda[][], dibujo: string[], x0: number, y0: number, color: string) {
  dibujo.forEach((linea, dy) =>
    [...linea].forEach((c, dx) => {
      const fila = destino[y0 + dy];
      if (c !== " " && fila && x0 + dx >= 0 && x0 + dx < fila.length) fila[x0 + dx] = [c, color];
    }),
  );
}

// Agrupa caracteres consecutivos del mismo color para generar pocos <span>
function Filas({ celdas }: { celdas: Celda[][] }) {
  return celdas.map((fila, y) => {
    const tramos: { color: string; texto: string }[] = [];
    for (const [c, color] of fila) {
      const ultimo = tramos.at(-1);
      if (ultimo && (ultimo.color === color || c === " ")) ultimo.texto += c;
      else tramos.push({ color, texto: c });
    }
    return (
      <div key={y}>
        {tramos.map((t, i) => (
          <span key={i} className={t.color}>
            {t.texto}
          </span>
        ))}
      </div>
    );
  });
}

// alto: interlineado en em (leading / tamaño de fuente), para ubicar las capas
function Lienzo({
  celdas,
  className,
  puntos = [],
  bloques = [],
  alto = 1,
  children,
}: {
  celdas: Celda[][];
  className: string;
  puntos?: Punto[];
  bloques?: Bloque[];
  alto?: number;
  children?: React.ReactNode;
}) {
  const grupos = new Map<string, Punto[]>();
  for (const p of puntos) grupos.set(p.grupo, [...(grupos.get(p.grupo) ?? []), p]);
  return (
    <div aria-hidden className={`pointer-events-none select-none font-mono ${className}`}>
      <pre>
        <Filas celdas={celdas} />
      </pre>
      {children}
      {bloques.map((b, i) => (
        <pre key={i} className={`absolute ${b.grupo}`} style={{ left: `${b.x}ch`, top: `${b.y * alto}em` }}>
          <Filas celdas={b.celdas} />
        </pre>
      ))}
      {[...grupos].map(([grupo, lista]) => (
        <div key={grupo} className={`absolute inset-0 ${grupo}`}>
          {lista.map((p) => (
            <span
              key={`${p.x}-${p.y}`}
              className={`absolute ${p.color}`}
              style={{ left: `${p.x}ch`, top: `${p.y * alto}em` }}
            >
              {p.c}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Dibujo({ lineas, className }: { lineas: string[]; className: string }) {
  return (
    <pre aria-hidden className={`pointer-events-none select-none font-mono ${className}`}>
      {lineas.join("\n")}
    </pre>
  );
}

/* ---------- Piezas reutilizables ---------- */

const CACTUS = [
  "    _    ",
  "   | |   ",
  " _ | |   ",
  "| || | _ ",
  "| || || |",
  " \\_  _/ ",
  "   | |   ",
  "   | |   ",
];

function alturasDunas(x: number, base: number) {
  return [
    base + 3 * Math.sin(x / 23) + 2 * Math.sin(x / 9 + 1),
    base + 6 + 2.5 * Math.sin(x / 17 + 2) + 1.5 * Math.sin(x / 7),
    base + 12 + 1.2 * Math.sin(x / 13),
  ];
}

function duna(x: number, y: number, base: number): Celda | null {
  const [d1, d2, d3] = alturasDunas(x, base);
  if (y >= d3) return y < d3 + 1 ? ["_", "text-cafe/60"] : [elegir(".. .", x, y), "text-arena-300"];
  if (y >= d2) return y < d2 + 1 ? ["~", "text-cafe/60"] : [elegir("~-~=", x, y), "text-arena-500"];
  if (y >= d1) return y < d1 + 1 ? ["_", "text-cafe/60"] : [elegir("::.:", x, y), "text-arena-400"];
  return null;
}

function plantarCactus(celdas: Celda[][], x0: number, base: number) {
  const suelo = Math.floor(alturasDunas(x0, base)[1]);
  estampar(celdas, CACTUS, x0, suelo - CACTUS.length + 2, "text-cafe/70");
}

/* ---------- Paisaje: sol setentero sobre Samalayuca ---------- */

type OpcionesPaisaje = {
  columnas: number;
  filas: number;
  base: number;
  // elevacion: filas extra entre el sol y la cresta más alta que tiene debajo
  sol: { cx: number; r: number; elevacion?: number };
  cactus: number[];
};

function paisaje({ columnas, filas, base, sol, cactus }: OpcionesPaisaje) {
  // Sol completo, apoyado encima de la cresta más alta que tiene debajo
  const { cx, r, elevacion = 0 } = sol;
  let horizonte = Infinity;
  for (let x = Math.floor(cx - r * ASPECTO); x <= cx + r * ASPECTO; x++) {
    horizonte = Math.min(horizonte, alturasDunas(x, base)[0]);
  }
  const cy = Math.floor(horizonte) - r - 1 - elevacion;
  // Franjas en la mitad inferior; un sol más chico lleva menos franjas
  const cortes = Array.from({ length: Math.max(1, Math.floor(r / 3)) }, (_, k) => cy + 2 * (k + 1));

  const celdaSol = (x: number, y: number): Celda | null => {
    const d = Math.hypot((x - cx) / ASPECTO, y - cy);
    if (d > r - 0.4) return null;
    if (cortes.includes(y)) return [" ", ""];
    const color = y < cy - r / 4 ? "text-mostaza" : y < cy + r / 4 ? "text-naranja" : "text-ladrillo";
    return [d > r - 1 ? "*" : elegir("##=#", x, y), color];
  };

  const estrellas: Punto[] = [];
  const celdas = lienzo(columnas, filas, (x, y) => {
    const suelo = duna(x, y, base);
    if (suelo) return suelo;
    if (celdaSol(x, y)) return [" ", ""];
    // Cielo: rejilla tenue de puntos; las estrellas van en su propia capa
    if (ruido(x + 7, y + 11) > 0.994) {
      estrellas.push({ x, y, c: elegir("+*", x, y), color: "text-arena-400", grupo: `titilar ${variante(x, y)}` });
      return [" ", ""];
    }
    if (x % 4 === 0 && y % 2 === 0) return [".", "text-arena-300"];
    return [" ", ""];
  });
  cactus.forEach((x) => plantarCactus(celdas, x, base));

  const x0 = Math.floor(cx - r * ASPECTO);
  const ancho = Math.ceil(cx + r * ASPECTO) - x0 + 1;
  const y0 = cy - r;
  const bloqueSol: Bloque = {
    x: x0,
    y: y0,
    grupo: "sol-respira",
    celdas: lienzo(ancho, 2 * r + 1, (x, y) => celdaSol(x0 + x, y0 + y) ?? [" ", ""]),
  };

  return {
    celdas,
    // Una estrella que haya quedado bajo un cactus ya no se dibuja
    estrellas: estrellas.filter((e) => celdas[e.y][e.x][0] === " "),
    sol: bloqueSol,
    centro: { x: cx + 0.5, y: cy + 0.5, ancho: 2 * r * ASPECTO + 8, alto: 2 * r + 8 },
  };
}

// Resplandor del sol: un degradado que pulsa en su propia capa
function Resplandor({ centro }: { centro: ReturnType<typeof paisaje>["centro"] }) {
  return (
    <div
      className="sol-brillo absolute -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(220_161_55/0.28),transparent)]"
      style={{ left: `${centro.x}ch`, top: `${centro.y}em`, width: `${centro.ancho}ch`, height: `${centro.alto}em` }}
    />
  );
}

const portada = paisaje({
  columnas: 240,
  filas: 110,
  base: 91,
  sol: { cx: 175, r: 13, elevacion: 10 }, // a la derecha del texto, flotando sobre el horizonte
  cactus: [30, 95, 192],
});

export function ArteAscii() {
  return (
    <Lienzo
      celdas={portada.celdas}
      puntos={portada.estrellas}
      bloques={[portada.sol]}
      className="absolute bottom-0 left-1/2 -translate-x-[calc(50%+238px)] text-[9px] leading-[9px] sm:-translate-x-[calc(50%+252px)] sm:text-[12px] sm:leading-[12px] lg:-translate-x-1/2"
    >
      <Resplandor centro={portada.centro} />
    </Lienzo>
  );
}

/* ---------- Cabecera de páginas internas: paisaje bajo ---------- */

const cabecera = paisaje({
  columnas: 240,
  filas: 30,
  base: 17,
  sol: { cx: 168, r: 5 },
  cactus: [40, 110, 205],
});

export function PaisajeCabecera() {
  return (
    <Lienzo
      celdas={cabecera.celdas}
      puntos={cabecera.estrellas}
      bloques={[cabecera.sol]}
      className="absolute bottom-0 left-1/2 -translate-x-[calc(50%+150px)] text-[9px] leading-[9px] sm:-translate-x-[calc(50%+120px)] sm:text-[12px] sm:leading-[12px] lg:-translate-x-1/2"
    />
  );
}

/* ---------- La olimpiada: campo de bits que se desvanece ---------- */

const bits = (() => {
  const parpadean: Punto[] = [];
  const celdas = lienzo(120, 46, (x, y) => {
    const densidad = (x / 120) ** 2.4 * 0.6;
    if (ruido(x, y) >= densidad) return [" ", ""];
    const bit = elegir("01", x + 3, y);
    if (ruido(x + 5, y + 9) > 0.85) {
      parpadean.push({ x, y, c: bit, color: "text-arena-300", grupo: `parpadeo ${variante(x, y)}` });
      return [" ", ""];
    }
    return [bit, "text-arena-200"];
  });
  return { celdas, parpadean };
})();

export function CampoBits() {
  return (
    <Lienzo
      celdas={bits.celdas}
      puntos={bits.parpadean}
      alto={14 / 12}
      className="absolute right-0 top-1/2 -translate-y-1/2 text-[12px] leading-[14px]"
    />
  );
}

/* ---------- Competencias: computadora (OMI), Karel (OMIPS) y acertijo (Bebras) ---------- */

export const COMPUTADORA = [
  " .----------. ",
  " | >_ OMI   | ",
  " | #include | ",
  " '----------' ",
  "  _|______|_  ",
  " [__________] ",
];

export const KAREL = [
  "    .---.     ",
  "   ( o o )  * ",
  "  /|  =  |\\/ ",
  "   |_____|    ",
  "    |   |     ",
  "   _|   |_    ",
];

export const ACERTIJO = [
  " +---+---+---+ ",
  " | ? | # | ? | ",
  " +---+---+---+ ",
  " | # | ? | # | ",
  " +---+---+---+ ",
  "  15 acertijos ",
];

export function Ilustracion({ lineas }: { lineas: string[] }) {
  return (
    <Dibujo
      lineas={lineas}
      className="text-[10px] leading-[12px] text-cafe/70 sm:text-[11px] sm:leading-[13px]"
    />
  );
}

/* ---------- Etapas: trofeo en fósforo ---------- */

const TROFEO = [
  " .-=========-. ",
  " \\'-=======-'/ ",
  " _|   .=.   |_ ",
  "((|  {OMI}  |))",
  " \\|   /|\\   |/ ",
  "  \\__ '`' __/  ",
  "    _`) (`_    ",
  "  _/_______\\_  ",
  " /___________\\ ",
];

const trofeo = TROFEO.map((linea) => [...linea].map((c): Celda => [c, "text-fosforo"]));

export function Trofeo() {
  // El brillo intenso es una copia encima que aparece y desaparece
  return (
    <Lienzo
      celdas={trofeo}
      bloques={[{ x: 0, y: 0, celdas: trofeo, grupo: "brillo-fosforo [text-shadow:0_0_10px_rgb(255_181_71/0.75)]" }]}
      alto={13 / 11}
      className="relative hidden text-[11px] leading-[13px] [text-shadow:0_0_4px_rgb(255_181_71/0.4)] lg:block"
    />
  );
}

/* ---------- Prepárate: teclado de fondo ---------- */

const teclado = (() => {
  const columnas = 260;
  const renglones = ["1234567890", "QWERTYUIOP", "ASDFGHJKL;", "ZXCVBNM,./"];
  const lineas: string[] = [];
  for (let bloque = 0; bloque < 4; bloque++) {
    renglones.forEach((teclas, r) => {
      const sangria = " ".repeat(((r + bloque) % 4) * 2);
      let tapas = sangria;
      let fondos = sangria;
      for (let i = 0; tapas.length < columnas; i++) {
        tapas += `|${teclas[i % teclas.length]}  `;
        fondos += "|___";
      }
      if (r === 0) lineas.push(sangria + " ___".repeat(columnas / 4));
      lineas.push(tapas, fondos);
    });
    lineas.push("");
  }
  const pulsan: Punto[] = [];
  const celdas = lineas.map((linea, y) =>
    [...linea.slice(0, columnas)].map((c, x): Celda => {
      // Algunas teclas se encienden en naranja: una copia encima que aparece
      if (!"|_ ".includes(c) && ruido(x, y) > 0.96) {
        pulsan.push({ x, y, c, color: "text-naranja", grupo: `tecla-pulsa ${variante(x, y)}` });
      }
      return [c, ""];
    }),
  );
  return { celdas, pulsan };
})();

export function Teclado() {
  return (
    <Lienzo
      celdas={teclado.celdas}
      puntos={teclado.pulsan}
      alto={14 / 12}
      className="absolute inset-x-0 top-0 text-[12px] leading-[14px] text-arena-300"
    />
  );
}

/* ---------- Noticias: antena transmitiendo ---------- */

const ANTENA = [
  "  ((  (  ( o )  )  ))  ",
  "          /|\\          ",
  "         / | \\         ",
  "        /--+--\\        ",
  "       /   |   \\       ",
  "      /----+----\\      ",
  "     /     |     \\     ",
  "  __/______|______\\__  ",
];

const RETRASO_ONDA = ["[--ret:0s]", "[--ret:0.3s]", "[--ret:0.6s]"];
const CENTRO_ANTENA = ANTENA[0].indexOf("o");

const antena = (() => {
  const ondas: Punto[] = [];
  const celdas = ANTENA.map((linea, y) =>
    [...linea].map((c, x): Celda => {
      if (y === 0 && (c === "(" || c === ")")) {
        const distancia = Math.abs(x - CENTRO_ANTENA);
        const anillo = distancia <= 2 ? 0 : distancia <= 5 ? 1 : 2;
        ondas.push({ x, y, c, color: "text-naranja", grupo: `onda ${RETRASO_ONDA[anillo]}` });
        return [" ", ""];
      }
      return [c, "text-arena-500"];
    }),
  );
  return { celdas, ondas };
})();

export function Antena() {
  return (
    <Lienzo
      celdas={antena.celdas}
      puntos={antena.ondas}
      alto={14 / 12}
      className="relative hidden text-[12px] leading-[14px] md:block"
    />
  );
}

/* ---------- Preguntas: signo de interrogación gigante ---------- */

const SIGNO = [
  "  #####  ",
  " ##   ## ",
  "##     ##",
  "      ## ",
  "     ##  ",
  "    ##   ",
  "    ##   ",
  "         ",
  "    ##   ",
  "    ##   ",
];

const signo = lienzo(SIGNO[0].length * 3, SIGNO.length * 2, (x, y) => {
  const lleno = SIGNO[Math.floor(y / 2)][Math.floor(x / 3)] === "#";
  return lleno ? ["?", "text-arena-400"] : [" ", ""];
});

export function SignoPregunta() {
  return <Lienzo celdas={signo} className="flotar mt-4 hidden text-[12px] leading-[12px] lg:block" />;
}

/* ---------- Pie: rótulo OMICHH en bloques + dunas ---------- */

const LETRAS: Record<string, string[]> = {
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  I: ["###", " # ", " # ", " # ", "###"],
  C: [" ###", "#   ", "#   ", "#   ", " ###"],
  H: ["#  #", "#  #", "####", "#  #", "#  #"],
};
const COLORES_FRANJA = ["text-mostaza", "text-naranja", "text-naranja", "text-ladrillo", "text-cafe"];

const rotulo = COLORES_FRANJA.map((color, fila) => {
  const texto = [..."OMICHH"]
    .map((l) => [...LETRAS[l][fila]].map((p) => (p === "#" ? "##" : "  ")).join(""))
    .join("  ");
  return [...texto].map((c): Celda => [c, color]);
});

export function Rotulo() {
  return (
    <Lienzo celdas={rotulo} className="text-[9px] leading-[9px] sm:text-[14px] sm:leading-[14px]" />
  );
}

const dunasPie = (() => {
  const celdas = lienzo(260, 16, (x, y) => duna(x, y, 4) ?? [" ", ""]);
  [30, 150, 228].forEach((x) => plantarCactus(celdas, x, 4));
  return celdas;
})();

export function DunasPie() {
  return (
    <Lienzo
      celdas={dunasPie}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] leading-[10px] sm:text-[12px] sm:leading-[12px]"
    />
  );
}
