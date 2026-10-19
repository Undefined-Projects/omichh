import "server-only";
import { connection } from "next/server";
import { CONCURSOS, NIVELES_ESCUELA } from "./catalogos";
import { edadEn } from "./curp";
import { db } from "./db";
import { exigirAdmin } from "./sesion";

export type Dato = { etiqueta: string; valor: number };

const etiquetaConcurso = (v: string) => CONCURSOS.find((c) => c.valor === v)?.etiqueta.replace(" / aún no sé", "") ?? v;
const etiquetaNivel = (v: string) => NIVELES_ESCUELA.find((n) => n.valor === v)?.etiqueta ?? v;
const etiquetaSexo = (v: string) => ({ H: "Hombre", M: "Mujer", X: "No binario" })[v] ?? v;

// Fecha límite de nacimiento de la convocatoria OMI 2026
const NACIDOS_DESPUES_DE = "2007-07-01";

async function filas(sql: string, args: (string | number)[] = []) {
  const { rows } = await (await db()).execute({ sql, args });
  return rows;
}

const conteo = (rows: Awaited<ReturnType<typeof filas>>, etiqueta: (v: string) => string = (v) => v): Dato[] =>
  rows.map((r) => ({ etiqueta: etiqueta(String(r.clave)), valor: Number(r.n) }));

/* ---------- Resumen ---------- */

export async function resumen() {
  await exigirAdmin();
  // Edades y semanas dependen de la fecha de hoy: siempre en tiempo de petición
  await connection();
  const [totales] = await filas(`SELECT
      (SELECT COUNT(*) FROM competidores) AS competidores,
      (SELECT COUNT(*) FROM competidores WHERE estado = 'pendiente') AS competidores_pendientes,
      (SELECT COUNT(*) FROM entrenadores) AS entrenadores,
      (SELECT COUNT(*) FROM entrenadores WHERE estado = 'pendiente') AS entrenadores_pendientes,
      (SELECT COUNT(*) FROM escuelas WHERE estado = 'validada') AS escuelas,
      (SELECT COUNT(*) FROM escuelas WHERE estado = 'propuesta') AS escuelas_propuestas,
      (SELECT COUNT(DISTINCT municipio_id) FROM (SELECT municipio_id FROM competidores UNION SELECT municipio_id FROM entrenadores)) AS municipios,
      (SELECT COUNT(*) FROM competidores WHERE fecha_nacimiento > ?) AS cumplen_edad_omi`, [NACIDOS_DESPUES_DE]);

  const [porConcurso, porNivel, porSexo, porMunicipio, porEscuela, porEntidad, porEstado, nacimientos, semanas, entrenadoresMunicipio, entrenadoresEscuela] =
    await Promise.all([
      filas("SELECT concurso AS clave, COUNT(*) AS n FROM competidores GROUP BY concurso ORDER BY n DESC"),
      filas(`SELECT nivel_escolar AS clave, COUNT(*) AS n FROM competidores GROUP BY nivel_escolar
             ORDER BY CASE nivel_escolar WHEN 'primaria' THEN 1 WHEN 'secundaria' THEN 2 ELSE 3 END`),
      filas("SELECT sexo AS clave, COUNT(*) AS n FROM competidores GROUP BY sexo ORDER BY n DESC"),
      filas(`SELECT m.nombre AS clave, COUNT(*) AS n FROM competidores c JOIN municipios m ON m.id = c.municipio_id
             GROUP BY m.id ORDER BY n DESC, m.nombre LIMIT 10`),
      // La escuela del competidor es texto libre: se agrupa sin distinguir mayúsculas ni espacios
      filas(`SELECT MIN(escuela_nombre) AS clave, COUNT(*) AS n FROM competidores
             GROUP BY UPPER(TRIM(escuela_nombre)) ORDER BY n DESC, clave LIMIT 10`),
      filas("SELECT entidad_nacimiento AS clave, COUNT(*) AS n FROM competidores GROUP BY entidad_nacimiento ORDER BY n DESC LIMIT 8"),
      filas("SELECT estado AS clave, COUNT(*) AS n FROM competidores GROUP BY estado ORDER BY n DESC"),
      filas("SELECT fecha_nacimiento FROM competidores"),
      filas(`SELECT date(creado_en) AS dia FROM competidores WHERE creado_en >= date('now', '-182 days')
             UNION ALL SELECT date(creado_en) FROM entrenadores WHERE creado_en >= date('now', '-182 days')`),
      filas(`SELECT m.nombre AS clave, COUNT(*) AS n FROM entrenadores e JOIN municipios m ON m.id = e.municipio_id
             GROUP BY m.id ORDER BY n DESC, m.nombre LIMIT 10`),
      filas(`SELECT s.nombre AS clave, COUNT(*) AS n FROM entrenadores e JOIN escuelas s ON s.id = e.escuela_id
             GROUP BY s.id ORDER BY n DESC, s.nombre LIMIT 10`),
    ]);

  // Edades cumplidas hoy, de 8 a 19 años; fuera de ese rango se agrupan en los extremos
  const hoy = new Date();
  const edades = new Map<number, number>();
  for (const r of nacimientos) {
    const edad = Math.min(19, Math.max(8, edadEn(String(r.fecha_nacimiento), hoy)));
    edades.set(edad, (edades.get(edad) ?? 0) + 1);
  }
  const porEdad: Dato[] = Array.from({ length: 12 }, (_, i) => {
    const edad = i + 8;
    return { etiqueta: edad === 8 ? "≤8" : edad === 19 ? "≥19" : String(edad), valor: edades.get(edad) ?? 0 };
  });

  return {
    totales: Object.fromEntries(Object.entries(totales).map(([k, v]) => [k, Number(v)])) as Record<string, number>,
    porConcurso: conteo(porConcurso, etiquetaConcurso),
    porNivel: conteo(porNivel, etiquetaNivel),
    porSexo: conteo(porSexo, etiquetaSexo),
    porMunicipio: conteo(porMunicipio),
    porEscuela: conteo(porEscuela),
    porEntidad: conteo(porEntidad),
    porEstado: conteo(porEstado, (v) => v[0].toUpperCase() + v.slice(1)),
    porEdad,
    porSemana: porSemana(semanas.map((r) => String(r.dia)), hoy),
    entrenadoresPorMunicipio: conteo(entrenadoresMunicipio),
    entrenadoresPorEscuela: conteo(entrenadoresEscuela),
  };
}

// Preregistros (competidores y entrenadores) de las últimas 26 semanas, de lunes a
// domingo, incluidas las semanas sin registros
function porSemana(dias: string[], hoy: Date): Dato[] {
  const lunes = (d: Date) => {
    const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
    return x;
  };
  const inicio = lunes(new Date(hoy.getTime() - 25 * 7 * 86400_000));
  const semanas = Array.from({ length: 26 }, (_, i) => ({
    desde: new Date(inicio.getTime() + i * 7 * 86400_000),
    valor: 0,
  }));
  for (const dia of dias) {
    const i = Math.floor((lunes(new Date(`${dia}T00:00:00Z`)).getTime() - inicio.getTime()) / (7 * 86400_000));
    if (i >= 0 && i < 26) semanas[i].valor++;
  }
  const formato = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" });
  return semanas.map((s) => ({ etiqueta: formato.format(s.desde), valor: s.valor }));
}

/* ---------- Tablas ---------- */

export type FiltrosCompetidores = { q?: string; concurso?: string; nivel?: string; estado?: string; municipio?: string };

export async function listarCompetidores(f: FiltrosCompetidores) {
  await exigirAdmin();
  // Edades y semanas dependen de la fecha de hoy: siempre en tiempo de petición
  await connection();
  const donde: string[] = [];
  const args: (string | number)[] = [];
  if (f.q) {
    donde.push("(c.nombres || ' ' || c.apellido_paterno || ' ' || IFNULL(c.apellido_materno, '') || ' ' || c.curp || ' ' || c.correo || ' ' || c.escuela_nombre) LIKE ?");
    args.push(`%${f.q}%`);
  }
  if (f.concurso) {
    donde.push("c.concurso = ?");
    args.push(f.concurso);
  }
  if (f.nivel) {
    donde.push("c.nivel_escolar = ?");
    args.push(f.nivel);
  }
  if (f.estado) {
    donde.push("c.estado = ?");
    args.push(f.estado);
  }
  if (f.municipio) {
    donde.push("c.municipio_id = ?");
    args.push(Number(f.municipio));
  }
  const rows = await filas(
    `SELECT c.*, m.nombre AS municipio FROM competidores c JOIN municipios m ON m.id = c.municipio_id
     ${donde.length ? `WHERE ${donde.join(" AND ")}` : ""} ORDER BY c.creado_en DESC LIMIT 500`,
    args,
  );
  const hoy = new Date();
  return rows.map((r) => ({
    id: Number(r.id),
    nombre: [r.nombres, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(" "),
    curp: String(r.curp),
    edad: edadEn(String(r.fecha_nacimiento), hoy),
    cumpleEdadOmi: String(r.fecha_nacimiento) > NACIDOS_DESPUES_DE,
    sexo: String(r.sexo),
    concurso: etiquetaConcurso(String(r.concurso)),
    escuela: String(r.escuela_nombre),
    nivel: etiquetaNivel(String(r.nivel_escolar)),
    anio: String(r.anio_escolar),
    municipio: String(r.municipio),
    correo: String(r.correo),
    celular: String(r.celular),
    telefono: r.telefono ? String(r.telefono) : "",
    entidad: String(r.entidad_nacimiento),
    comentarios: r.comentarios ? String(r.comentarios) : "",
    estado: String(r.estado),
    creado: String(r.creado_en),
  }));
}

export async function listarEntrenadores() {
  await exigirAdmin();
  // Edades y semanas dependen de la fecha de hoy: siempre en tiempo de petición
  await connection();
  const rows = await filas(`SELECT e.*, m.nombre AS municipio, s.nombre AS escuela, s.estado AS escuela_estado
    FROM entrenadores e JOIN municipios m ON m.id = e.municipio_id JOIN escuelas s ON s.id = e.escuela_id
    ORDER BY CASE e.estado WHEN 'pendiente' THEN 0 ELSE 1 END, e.creado_en DESC`);
  const hoy = new Date();
  return rows.map((r) => ({
    id: Number(r.id),
    nombre: [r.titulo, r.nombres, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(" "),
    curp: String(r.curp),
    edad: edadEn(String(r.fecha_nacimiento), hoy),
    sexo: String(r.sexo),
    correo: String(r.correo),
    celular: String(r.celular),
    municipio: String(r.municipio),
    escuela: String(r.escuela),
    escuelaPropuesta: r.escuela_estado === "propuesta",
    omegaup: r.usuario_omegaup ? String(r.usuario_omegaup) : "",
    estado: String(r.estado),
    creado: String(r.creado_en),
  }));
}

export async function listarEscuelas() {
  await exigirAdmin();
  const rows = await filas(`SELECT s.*, m.nombre AS municipio,
      (SELECT COUNT(*) FROM entrenadores e WHERE e.escuela_id = s.id) AS entrenadores
    FROM escuelas s JOIN municipios m ON m.id = s.municipio_id
    ORDER BY CASE s.estado WHEN 'propuesta' THEN 0 WHEN 'validada' THEN 1 ELSE 2 END, m.nombre, s.nombre`);
  return rows.map((r) => ({
    id: Number(r.id),
    nombre: String(r.nombre),
    corto: r.nombre_corto ? String(r.nombre_corto) : "",
    municipio: String(r.municipio),
    nivel: etiquetaNivel(String(r.nivel)),
    estado: String(r.estado),
    entrenadores: Number(r.entrenadores),
  }));
}

// Filas completas para exportar a CSV
export async function exportar(tipo: "competidores" | "entrenadores" | "escuelas") {
  await exigirAdmin();
  const consultas = {
    competidores: `SELECT c.id, c.creado_en, c.estado, c.concurso, c.nombres, c.apellido_paterno, c.apellido_materno, c.curp,
        c.sexo, c.fecha_nacimiento, c.entidad_nacimiento, c.correo, c.celular, c.telefono, c.escuela_nombre, c.nivel_escolar,
        c.anio_escolar, m.nombre AS municipio, c.estado_residencia, c.comentarios
      FROM competidores c JOIN municipios m ON m.id = c.municipio_id ORDER BY c.creado_en`,
    entrenadores: `SELECT e.id, e.creado_en, e.estado, e.titulo, e.nombres, e.apellido_paterno, e.apellido_materno, e.curp,
        e.sexo, e.fecha_nacimiento, e.entidad_nacimiento, e.correo, e.celular, m.nombre AS municipio, e.usuario_omegaup,
        s.nombre AS escuela
      FROM entrenadores e JOIN municipios m ON m.id = e.municipio_id JOIN escuelas s ON s.id = e.escuela_id ORDER BY e.creado_en`,
    escuelas: `SELECT s.id, s.nombre, s.nombre_corto, m.nombre AS municipio, s.nivel, s.estado, s.creada_en
      FROM escuelas s JOIN municipios m ON m.id = s.municipio_id ORDER BY m.nombre, s.nombre`,
  };
  const { rows, columns } = await (await db()).execute(consultas[tipo]);
  return { columnas: columns, filas: rows.map((r) => columns.map((c) => r[c])) };
}
