import "server-only";
import { mkdirSync } from "node:fs";
import { createClient, type Client } from "@libsql/client";
import { ESCUELAS_INICIALES, MUNICIPIOS } from "./catalogos";

// libSQL: en local es un archivo SQLite (datos/omichh.db). En Vercel el disco no
// persiste, así que se conecta a Turso con TURSO_DATABASE_URL y TURSO_AUTH_TOKEN.
const url = process.env.TURSO_DATABASE_URL ?? "file:datos/omichh.db";
if (url.startsWith("file:")) mkdirSync("datos", { recursive: true });

const ESQUEMA = `
CREATE TABLE IF NOT EXISTS municipios (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS escuelas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  nombre_corto TEXT,
  municipio_id INTEGER NOT NULL REFERENCES municipios(id),
  nivel TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'validada' CHECK (estado IN ('validada', 'propuesta', 'rechazada')),
  creada_en TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS entrenadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  nombres TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL,
  apellido_materno TEXT,
  curp TEXT NOT NULL UNIQUE,
  sexo TEXT NOT NULL,
  fecha_nacimiento TEXT NOT NULL,
  entidad_nacimiento TEXT NOT NULL,
  correo TEXT NOT NULL,
  celular TEXT NOT NULL,
  municipio_id INTEGER NOT NULL REFERENCES municipios(id),
  usuario_omegaup TEXT,
  escuela_id INTEGER NOT NULL REFERENCES escuelas(id),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'validado', 'rechazado')),
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS competidores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  concurso TEXT NOT NULL CHECK (concurso IN ('general', 'omi', 'omips')),
  nombres TEXT NOT NULL,
  apellido_paterno TEXT NOT NULL,
  apellido_materno TEXT,
  curp TEXT NOT NULL UNIQUE,
  sexo TEXT NOT NULL,
  fecha_nacimiento TEXT NOT NULL,
  entidad_nacimiento TEXT NOT NULL,
  correo TEXT NOT NULL,
  celular TEXT NOT NULL,
  telefono TEXT,
  escuela_nombre TEXT NOT NULL,
  nivel_escolar TEXT NOT NULL,
  anio_escolar TEXT NOT NULL,
  municipio_id INTEGER NOT NULL REFERENCES municipios(id),
  estado_residencia TEXT,
  comentarios TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'contactado', 'aceptado', 'descartado')),
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS administradores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  correo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  contrasena TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sesiones (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES administradores(id) ON DELETE CASCADE,
  expira_en TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS competidores_creado ON competidores(creado_en);
CREATE INDEX IF NOT EXISTS entrenadores_creado ON entrenadores(creado_en);
`;

let cliente: Client | null = null;
let preparada: Promise<void> | null = null;

async function preparar(db: Client) {
  await db.executeMultiple(ESQUEMA);
  const { rows } = await db.execute("SELECT COUNT(*) AS n FROM municipios");
  if (Number(rows[0].n) > 0) return;
  // Primera vez: catálogos del formulario anterior
  await db.batch(
    [
      ...MUNICIPIOS.map((m) => ({ sql: "INSERT INTO municipios (id, nombre) VALUES (?, ?)", args: [m.id, m.nombre] })),
      ...ESCUELAS_INICIALES.map((e) => ({
        sql: "INSERT INTO escuelas (id, nombre, municipio_id, nivel) VALUES (?, ?, ?, ?)",
        args: [e.id, e.nombre, e.municipioId, e.nivel],
      })),
    ],
    "write",
  );
}

// Cliente único, con el esquema listo antes de la primera consulta
export async function db() {
  if (!cliente) {
    cliente = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    preparada = preparar(cliente);
  }
  await preparada;
  return cliente;
}
