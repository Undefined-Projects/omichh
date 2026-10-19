// Genera los mosaicos de fondo ASCII en public/fondos/*.svg.
// Cada SVG se usa como máscara CSS, así que el color lo pone la hoja de
// estilos y aquí todo se dibuja en negro. Uso: npm run fondos

import { mkdirSync, writeFileSync } from "node:fs";

const ANCHO_CELDA = 7.2; // 12px de fuente monoespaciada
const ALTO_CELDA = 14;

function ruido(x, y, semilla = 0) {
  let h = Math.imul(x * 374761393 + y * 668265263 + semilla * 2147483647, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function elegir(texto, x, y, semilla) {
  return texto[Math.floor(ruido(x, y, semilla) * texto.length)];
}

function lienzo(columnas, filas, relleno = " ") {
  return Array.from({ length: filas }, () => Array(columnas).fill(relleno));
}

function escribir(celdas, x, y, texto) {
  const filas = celdas.length;
  const columnas = celdas[0].length;
  [...texto].forEach((c, i) => {
    celdas[(y + filas) % filas][(x + i + columnas) % columnas] = c;
  });
}

const escapar = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg(celdas) {
  const columnas = celdas[0].length;
  const ancho = +(columnas * ANCHO_CELDA).toFixed(1);
  const alto = celdas.length * ALTO_CELDA;
  const lineas = celdas
    .map((fila, y) => {
      const texto = fila.join("");
      if (!texto.trim()) return "";
      return `<text x="0" y="${y * ALTO_CELDA + 11}" textLength="${ancho}" lengthAdjust="spacing">${escapar(texto)}</text>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}"><style>text{font:12px ui-monospace,Menlo,Consolas,"Liberation Mono",monospace;white-space:pre}</style>${lineas}</svg>`;
}

/* ---------- Patrones ---------- */

// Circuito impreso: pistas que se doblan, pads y algún chip con etiqueta
function circuito() {
  const C = 72, F = 36;
  const c = lienzo(C, F);
  for (let k = 0; k < 34; k++) {
    let x = Math.floor(ruido(k, 1, 7) * C);
    let y = Math.floor(ruido(k, 2, 7) * F);
    let horizontal = ruido(k, 3, 7) > 0.35;
    let dir = ruido(k, 5, 7) > 0.5 ? 1 : -1;
    const largo = 6 + Math.floor(ruido(k, 4, 7) * 14);
    c[y][x] = "o";
    for (let paso = 0; paso < largo; paso++) {
      if (paso > 2 && ruido(k, paso, 9) > 0.8) {
        c[y][x] = "+";
        horizontal = !horizontal;
        dir = ruido(k, paso, 10) > 0.5 ? 1 : -1;
      }
      if (horizontal) x = (x + dir + C) % C;
      else y = (y + dir + F) % F;
      if (c[y][x] === " ") c[y][x] = horizontal ? "-" : "|";
    }
    c[y][x] = "o";
  }
  const chips = [
    [6, 5, "OMI"],
    [44, 22, "C++"],
    [28, 12, "IOI"],
    [58, 3, "CHH"],
  ];
  for (const [x, y, etiqueta] of chips) {
    escribir(c, x, y, "+-------+");
    escribir(c, x, y + 1, `|  ${etiqueta}  |`);
    escribir(c, x, y + 2, "+-------+");
    escribir(c, x + 2, y + 3, "| | |");
  }
  return c;
}

// Tarjeta perforada: renglones de dígitos con perforaciones
function perforada() {
  const C = 80, F = 24;
  const c = lienzo(C, F);
  const numeracion = Array.from({ length: C }, (_, x) => ((x + 1) % 10 === 0 ? String(((x + 1) / 10) % 10) : " ")).join("");
  escribir(c, 0, 0, numeracion);
  for (let d = 0; d <= 9; d++) {
    const fila = Array.from({ length: C }, (_, x) => (ruido(x, d, 3) > 0.86 ? "#" : x % 2 ? " " : String(d))).join("");
    escribir(c, 0, d * 2 + 3, fila);
  }
  return c;
}

// Hoja de codificación: cuadrícula ligera con puntos de referencia
function rejilla() {
  const C = 64, F = 32;
  const c = lienzo(C, F);
  for (let y = 0; y < F; y++) {
    for (let x = 0; x < C; x++) {
      if (y % 4 === 0) c[y][x] = x % 8 === 0 ? "+" : x % 2 === 0 ? "-" : " ";
      else if (x % 8 === 0) c[y][x] = y % 2 === 0 ? "|" : ":";
      else if (x % 8 === 4 && y % 4 === 2) c[y][x] = ".";
    }
  }
  return c;
}

// Ondas de radio: senoidales enteras para que el mosaico empate
function ondas() {
  const C = 96, F = 24;
  const c = lienzo(C, F);
  const lineas = [
    { base: 4, amp: 2, periodos: 2 },
    { base: 12, amp: 2.5, periodos: 3 },
    { base: 19, amp: 1.5, periodos: 4 },
  ];
  for (const { base, amp, periodos } of lineas) {
    for (let x = 0; x < C; x++) {
      const y = Math.round(base + amp * Math.sin((2 * Math.PI * periodos * x) / C));
      c[(y + F) % F][x] = "~";
      if (ruido(x, base, 5) > 0.7) c[(y + 1 + F) % F][x] = "-";
    }
  }
  return c;
}

// Volcado hexadecimal del nombre de la olimpiada
function hex() {
  const texto = "OLIMPIADA MEXICANA DE INFORMATICA EN CHIHUAHUA * OMICHH * OMI * OMIPS * BEBRAS * C++ * KAREL * ";
  const F = 24;
  const c = lienzo(60, F);
  for (let y = 0; y < F; y++) {
    const inicio = (y * 8) % texto.length;
    const trozo = Array.from({ length: 8 }, (_, i) => texto[(inicio + i) % texto.length]);
    const bytes = trozo.map((ch) => ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")).join(" ");
    const direccion = `0x${(y * 8).toString(16).toUpperCase().padStart(4, "0")}`;
    escribir(c, 2, y, `${direccion}  ${bytes}  |${trozo.join("")}|`);
  }
  return c;
}

// Cielo: estrellas sueltas, alguna constelación
function cielo() {
  const C = 80, F = 30;
  const c = lienzo(C, F);
  for (let y = 0; y < F; y++) {
    for (let x = 0; x < C; x++) {
      const n = ruido(x, y, 11);
      if (n > 0.985) c[y][x] = elegir("*+", x, y, 12);
      else if (n > 0.95) c[y][x] = ".";
    }
  }
  return c;
}

// Mundo de Karel: esquinas, paredes, zumbadores y el robot
function karel() {
  const C = 60, F = 30;
  const c = lienzo(C, F);
  for (let y = 0; y < F; y++) {
    for (let x = 0; x < C; x++) {
      if (y % 2 === 0 && x % 4 === 0) c[y][x] = ".";
    }
  }
  for (let k = 0; k < 14; k++) {
    const x = Math.floor(ruido(k, 1, 21) * (C / 4)) * 4;
    const y = Math.floor(ruido(k, 2, 21) * (F / 2)) * 2;
    if (ruido(k, 3, 21) > 0.5) escribir(c, x, y + 1, "----");
    else {
      c[y][(x + 2) % C] = "|";
      c[(y + 1) % F][(x + 2) % C] = "|";
    }
  }
  for (let k = 0; k < 10; k++) {
    const x = Math.floor(ruido(k, 4, 22) * (C / 4)) * 4;
    const y = Math.floor(ruido(k, 5, 22) * (F / 2)) * 2;
    c[y][x] = k < 3 ? elegir("^>v<", k, 0, 23) : String(1 + Math.floor(ruido(k, 6, 22) * 9));
  }
  return c;
}

// Cuadrícula de acertijos, con casillas resueltas y por resolver
function acertijos() {
  const C = 72, F = 28;
  const c = lienzo(C, F);
  for (let y = 0; y < F; y++) {
    for (let x = 0; x < C; x++) {
      if (y % 2 === 0) c[y][x] = x % 6 === 0 ? "+" : "-";
      else if (x % 6 === 0) c[y][x] = "|";
      else if (x % 6 === 3) {
        const n = ruido(Math.floor(x / 6), Math.floor(y / 2), 31);
        c[y][x] = n > 0.8 ? "?" : n > 0.65 ? "#" : n > 0.55 ? "o" : " ";
      }
    }
  }
  return c;
}

const patrones = { circuito, perforada, rejilla, ondas, hex, cielo, karel, acertijos };

const destino = new URL("../public/fondos/", import.meta.url);
mkdirSync(destino, { recursive: true });
for (const [nombre, generar] of Object.entries(patrones)) {
  const contenido = svg(generar());
  writeFileSync(new URL(`${nombre}.svg`, destino), contenido);
  console.log(`fondos/${nombre}.svg  ${(contenido.length / 1024).toFixed(1)} KB`);
}
