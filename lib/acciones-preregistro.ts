"use server";

import { CONCURSOS, ENTIDADES, MUNICIPIOS, NIVELES_ESCOLARES, NIVELES_ESCUELA, TITULOS } from "./catalogos";
import { fechaIso, leerCurp } from "./curp";
import { db } from "./db";

export type EstadoFormulario = {
  ok?: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
  valores?: Record<string, string>;
};

const texto = (f: FormData, campo: string) => String(f.get(campo) ?? "").trim();

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const soloDigitos = (v: string) => v.replace(/\D/g, "");

function validarComunes(f: FormData, errores: Record<string, string>) {
  const nombres = texto(f, "nombres");
  const apellidoPaterno = texto(f, "apellido_paterno");
  const apellidoMaterno = texto(f, "apellido_materno");
  if (!nombres) errores.nombres = "Escribe tu nombre o nombres.";
  if (!apellidoPaterno) errores.apellido_paterno = "Escribe tu apellido paterno.";

  const curp = leerCurp(texto(f, "curp"));
  if (!curp) errores.curp = "La CURP no es válida. Revisa los 18 caracteres.";

  const correo = texto(f, "correo").toLowerCase();
  if (!CORREO.test(correo)) errores.correo = "Escribe un correo electrónico válido.";

  const celular = soloDigitos(texto(f, "celular"));
  if (celular.length !== 10) errores.celular = "El celular debe tener 10 dígitos.";

  const municipioId = Number(texto(f, "municipio_id"));
  if (!MUNICIPIOS.some((m) => m.id === municipioId)) errores.municipio_id = "Selecciona tu municipio de residencia.";

  if (f.get("aviso_privacidad") !== "1") errores.aviso_privacidad = "Debes aceptar el aviso de privacidad.";

  return { nombres, apellidoPaterno, apellidoMaterno: apellidoMaterno || null, curp, correo, celular, municipioId };
}

function respuestaError(f: FormData, errores: Record<string, string>): EstadoFormulario {
  const valores: Record<string, string> = {};
  for (const [k, v] of f.entries()) if (typeof v === "string" && !k.startsWith("$")) valores[k] = v;
  return { errores, valores, mensaje: "Revisa los campos marcados." };
}

function esCurpRepetida(e: unknown) {
  return String((e as Error)?.message ?? e).includes("UNIQUE constraint failed") && String(e).includes("curp");
}

/* ---------- Entrenador / profesor ---------- */

export async function preregistrarEntrenador(_: EstadoFormulario, f: FormData): Promise<EstadoFormulario> {
  // Campo trampa "Sitio web (no llenar)": los bots lo llenan, las personas no lo ven
  if (texto(f, "sitio_web")) return { ok: true };

  const errores: Record<string, string> = {};
  const c = validarComunes(f, errores);

  const tituloElegido = texto(f, "titulo");
  let titulo: string | null = null;
  if (tituloElegido === "__otro__") {
    const otro = texto(f, "titulo_otro");
    if (!otro || otro.length > 15) errores.titulo_otro = "Especifica el título (máximo 15 caracteres).";
    titulo = otro;
  } else if (tituloElegido) {
    if (!(TITULOS as readonly string[]).includes(tituloElegido)) errores.titulo = "Selecciona un título de la lista.";
    titulo = tituloElegido;
  }

  const usuarioOmegaup = texto(f, "usuario_omegaup");
  if (usuarioOmegaup && !/^[\w.-]{2,50}$/.test(usuarioOmegaup)) {
    errores.usuario_omegaup = "El usuario de omegaUp solo lleva letras, números, punto, guion o guion bajo.";
  }

  const escuelaMunicipioId = Number(texto(f, "escuela_municipio_id"));
  if (!MUNICIPIOS.some((m) => m.id === escuelaMunicipioId)) {
    errores.escuela_municipio_id = "Selecciona el municipio de la escuela.";
  }

  const base = await db();
  const opcion = texto(f, "escuela_opcion");
  let escuelaId: number | null = null;
  const escuelaNueva = { nombre: "", corto: "", nivel: "" };
  if (opcion === "nueva") {
    escuelaNueva.nombre = texto(f, "escuela_nombre");
    escuelaNueva.corto = texto(f, "escuela_nombre_corto");
    escuelaNueva.nivel = texto(f, "escuela_nivel");
    if (!escuelaNueva.nombre) errores.escuela_nombre = "Escribe el nombre completo de la escuela.";
    if (!NIVELES_ESCUELA.some((n) => n.valor === escuelaNueva.nivel)) errores.escuela_nivel = "Selecciona el nivel educativo.";
  } else {
    escuelaId = Number(texto(f, "escuela_id"));
    const { rows } = await base.execute({
      sql: "SELECT id FROM escuelas WHERE id = ? AND municipio_id = ? AND estado = 'validada'",
      args: [escuelaId || 0, escuelaMunicipioId || 0],
    });
    if (!rows[0]) errores.escuela_id = "Selecciona tu escuela del listado o indica que no aparece.";
  }

  if (Object.keys(errores).length || !c.curp) return respuestaError(f, errores);

  try {
    const sentencias = [];
    if (opcion === "nueva") {
      // La escuela queda como propuesta hasta que el comité la valide
      sentencias.push({
        sql: "INSERT INTO escuelas (nombre, nombre_corto, municipio_id, nivel, estado) VALUES (?, ?, ?, ?, 'propuesta')",
        args: [escuelaNueva.nombre, escuelaNueva.corto || null, escuelaMunicipioId, escuelaNueva.nivel],
      });
    }
    sentencias.push({
      sql: `INSERT INTO entrenadores (titulo, nombres, apellido_paterno, apellido_materno, curp, sexo, fecha_nacimiento,
              entidad_nacimiento, correo, celular, municipio_id, usuario_omegaup, escuela_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${opcion === "nueva" ? "last_insert_rowid()" : "?"})`,
      args: [
        titulo,
        c.nombres,
        c.apellidoPaterno,
        c.apellidoMaterno,
        c.curp.curp,
        c.curp.sexo,
        c.curp.fechaNacimiento,
        c.curp.entidad,
        c.correo,
        c.celular,
        c.municipioId,
        usuarioOmegaup || null,
        ...(opcion === "nueva" ? [] : [escuelaId]),
      ],
    });
    await base.batch(sentencias, "write");
  } catch (e) {
    if (esCurpRepetida(e)) return respuestaError(f, { curp: "Ya existe un preregistro de entrenador con esta CURP." });
    throw e;
  }
  return {
    ok: true,
    mensaje: "Recibimos tu preregistro. Validaremos tu información y te contactaremos para activar tu cuenta.",
  };
}

/* ---------- Competidor ---------- */

export async function preregistrarCompetidor(_: EstadoFormulario, f: FormData): Promise<EstadoFormulario> {
  if (texto(f, "sitio_web")) return { ok: true };

  const errores: Record<string, string> = {};
  const c = validarComunes(f, errores);

  const concurso = texto(f, "concurso") || "general";
  if (!CONCURSOS.some((x) => x.valor === concurso)) errores.concurso = "Selecciona un concurso.";

  const fecha = fechaIso(texto(f, "fecha_nacimiento"));
  if (!fecha) errores.fecha_nacimiento = "Escribe la fecha como DD/MM/AAAA.";
  else if (c.curp && fecha !== c.curp.fechaNacimiento) errores.fecha_nacimiento = "La fecha no coincide con la CURP.";

  const entidad = texto(f, "entidad_nacimiento");
  if (!(ENTIDADES as readonly string[]).includes(entidad)) errores.entidad_nacimiento = "Selecciona la entidad de nacimiento.";
  else if (c.curp && entidad !== c.curp.entidad) errores.entidad_nacimiento = "La entidad no coincide con la CURP.";

  const telefono = soloDigitos(texto(f, "telefono"));
  if (telefono && telefono.length !== 10) errores.telefono = "El teléfono debe tener 10 dígitos.";

  const escuelaNombre = texto(f, "escuela_nombre");
  if (!escuelaNombre) errores.escuela_nombre = "Escribe el nombre completo de tu escuela.";
  const nivel = texto(f, "nivel_escolar");
  if (!NIVELES_ESCOLARES.some((n) => n.valor === nivel)) errores.nivel_escolar = "Selecciona tu nivel escolar.";
  const anio = texto(f, "anio_escolar");
  if (!anio || anio.length > 30) errores.anio_escolar = "Escribe tu año o grado escolar (p. ej. 2.º semestre).";

  const estado = texto(f, "estado").slice(0, 60);
  const comentarios = texto(f, "comentarios");
  if (comentarios.length > 1000) errores.comentarios = "Los comentarios no deben pasar de 1000 caracteres.";

  if (Object.keys(errores).length || !c.curp) return respuestaError(f, errores);

  try {
    await (await db()).execute({
      sql: `INSERT INTO competidores (concurso, nombres, apellido_paterno, apellido_materno, curp, sexo, fecha_nacimiento,
              entidad_nacimiento, correo, celular, telefono, escuela_nombre, nivel_escolar, anio_escolar, municipio_id,
              estado_residencia, comentarios)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        concurso,
        c.nombres,
        c.apellidoPaterno,
        c.apellidoMaterno,
        c.curp.curp,
        c.curp.sexo,
        c.curp.fechaNacimiento,
        entidad,
        c.correo,
        c.celular,
        telefono || null,
        escuelaNombre,
        nivel,
        anio,
        c.municipioId,
        estado || null,
        comentarios || null,
      ],
    });
  } catch (e) {
    if (esCurpRepetida(e)) return respuestaError(f, { curp: "Ya existe un preregistro de competidor con esta CURP." });
    throw e;
  }
  return {
    ok: true,
    mensaje:
      concurso === "omi"
        ? "Recibimos tu preregistro. La convocatoria OMI 2026 ya cerró: tu solicitud se considerará para la siguiente convocatoria."
        : "Recibimos tu preregistro. Te haremos llegar la información del proceso.",
  };
}
