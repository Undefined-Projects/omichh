"use client";

import { useActionState, useState } from "react";
import { preregistrarCompetidor, type EstadoFormulario } from "@/lib/acciones-preregistro";
import { CONCURSOS, ENTIDADES, MUNICIPIOS, NIVELES_ESCOLARES } from "@/lib/catalogos";
import { fechaMx, leerCurp } from "@/lib/curp";
import { aria, AvisoPrivacidad, Campo, Enviar, estiloControl, Exito, Grupo, Trampa } from "./campos";

export function FormularioCompetidor() {
  const [estado, accion, pendiente] = useActionState<EstadoFormulario, FormData>(preregistrarCompetidor, {});
  const v = estado.valores ?? {};
  const e = estado.errores;

  const [concurso, setConcurso] = useState(v.concurso ?? "");
  const [curp, setCurp] = useState(v.curp ?? "");
  const [fecha, setFecha] = useState(v.fecha_nacimiento ?? "");
  const [entidad, setEntidad] = useState(v.entidad_nacimiento ?? "");

  if (estado.ok) return <Exito mensaje={estado.mensaje ?? "Recibimos tu preregistro."} />;

  // Como en el formulario anterior: la fecha y la entidad se completan desde la CURP
  function cambiarCurp(valor: string) {
    const curpNueva = valor.toUpperCase();
    setCurp(curpNueva);
    const datos = leerCurp(curpNueva);
    if (datos) {
      setFecha(fechaMx(datos.fechaNacimiento));
      setEntidad(datos.entidad);
    }
  }

  return (
    <form action={accion} className="relative space-y-8" noValidate>
      <Trampa />
      {estado.mensaje && (
        <p role="alert" className="rounded-xl border-2 border-ladrillo bg-arena-50 px-4 py-3 text-ladrillo">
          {estado.mensaje}
        </p>
      )}

      <Grupo titulo="Datos del participante">
        <Campo nombre="concurso" etiqueta="Concurso de interés" error={e?.concurso} className="sm:col-span-2"
          ayuda={
            concurso === "omi"
              ? "Si eliges OMI, tu solicitud se considerará para las siguientes convocatorias."
              : "Si no hay un concurso disponible, envía el preregistro general y OMICHH te orientará."
          }>
          <select {...aria("concurso", e)} value={concurso} onChange={(x) => setConcurso(x.target.value)} className={estiloControl}>
            {CONCURSOS.map((c) => (
              <option key={c.valor} value={c.valor === "general" ? "" : c.valor}>
                {c.etiqueta}
              </option>
            ))}
          </select>
        </Campo>
        <div className="sm:col-span-2">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-tinta-suave">Participación</p>
          <p className="rounded-lg border-2 border-dashed border-tinta/25 px-3 py-2.5 text-tinta-suave">
            Competidor interesado sin entrenador asignado
          </p>
        </div>

        <Campo nombre="nombres" etiqueta="Nombre(s)" error={e?.nombres} requerido>
          <input {...aria("nombres", e)} defaultValue={v.nombres} autoComplete="given-name" required className={estiloControl} />
        </Campo>
        <Campo nombre="apellido_paterno" etiqueta="Apellido paterno" error={e?.apellido_paterno} requerido>
          <input {...aria("apellido_paterno", e)} defaultValue={v.apellido_paterno} required className={estiloControl} />
        </Campo>
        <Campo nombre="apellido_materno" etiqueta="Apellido materno" error={e?.apellido_materno}>
          <input {...aria("apellido_materno", e)} defaultValue={v.apellido_materno} className={estiloControl} />
        </Campo>
        <Campo nombre="curp" etiqueta="CURP" error={e?.curp} requerido ayuda="El sexo, la fecha y la entidad de nacimiento se completan a partir de la CURP.">
          <input {...aria("curp", e)} value={curp} onChange={(x) => cambiarCurp(x.target.value)} maxLength={18} required autoCapitalize="characters" className={`${estiloControl} font-mono uppercase`} />
        </Campo>
        <Campo nombre="fecha_nacimiento" etiqueta="Fecha de nacimiento" error={e?.fecha_nacimiento} requerido>
          <input {...aria("fecha_nacimiento", e)} value={fecha} onChange={(x) => setFecha(x.target.value)} placeholder="DD/MM/AAAA" inputMode="numeric" maxLength={10} required className={estiloControl} />
        </Campo>
        <Campo nombre="entidad_nacimiento" etiqueta="Entidad de nacimiento" error={e?.entidad_nacimiento} requerido>
          <select {...aria("entidad_nacimiento", e)} value={entidad} onChange={(x) => setEntidad(x.target.value)} required className={estiloControl}>
            <option value="">Selecciona…</option>
            {ENTIDADES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </Campo>
        <Campo nombre="correo" etiqueta="Correo electrónico" error={e?.correo} requerido>
          <input {...aria("correo", e)} type="email" defaultValue={v.correo} autoComplete="email" required className={estiloControl} />
        </Campo>
        <Campo nombre="celular" etiqueta="Celular" error={e?.celular} requerido>
          <input {...aria("celular", e)} type="tel" inputMode="numeric" defaultValue={v.celular} autoComplete="tel" required className={estiloControl} />
        </Campo>
        <Campo nombre="telefono" etiqueta="Teléfono" error={e?.telefono}>
          <input {...aria("telefono", e)} type="tel" inputMode="numeric" defaultValue={v.telefono} className={estiloControl} />
        </Campo>
      </Grupo>

      <Grupo titulo="Datos de la escuela">
        <p className="text-sm text-tinta-suave sm:col-span-2">
          Puedes capturar el nombre de tu escuela; la escuela oficial será validada o creada por el administrador.
        </p>
        <Campo nombre="escuela_nombre" etiqueta="Nombre completo de la escuela" error={e?.escuela_nombre} requerido className="sm:col-span-2">
          <input {...aria("escuela_nombre", e)} defaultValue={v.escuela_nombre} required className={estiloControl} />
        </Campo>
        <Campo nombre="nivel_escolar" etiqueta="Nivel escolar" error={e?.nivel_escolar} requerido>
          <select {...aria("nivel_escolar", e)} defaultValue={v.nivel_escolar ?? ""} required className={estiloControl}>
            <option value="">Selecciona…</option>
            {NIVELES_ESCOLARES.map((n) => (
              <option key={n.valor} value={n.valor}>
                {n.etiqueta}
              </option>
            ))}
          </select>
        </Campo>
        <Campo nombre="anio_escolar" etiqueta="Año escolar" error={e?.anio_escolar} requerido>
          <input {...aria("anio_escolar", e)} defaultValue={v.anio_escolar} placeholder="p. ej. 5.º de primaria" required className={estiloControl} />
        </Campo>
        <Campo nombre="municipio_id" etiqueta="Municipio de residencia" error={e?.municipio_id} requerido>
          <select {...aria("municipio_id", e)} defaultValue={v.municipio_id ?? ""} required className={estiloControl}>
            <option value="">Selecciona…</option>
            {MUNICIPIOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo nombre="estado" etiqueta="Estado" error={e?.estado}>
          <input {...aria("estado", e)} defaultValue={v.estado ?? "Chihuahua"} className={estiloControl} />
        </Campo>
      </Grupo>

      <Grupo titulo="Comentarios y privacidad">
        <Campo nombre="comentarios" etiqueta="Comentarios adicionales" error={e?.comentarios} className="sm:col-span-2">
          <textarea {...aria("comentarios", e)} defaultValue={v.comentarios} rows={4} maxLength={1000} className={estiloControl} />
        </Campo>
        <div className="sm:col-span-2">
          <AvisoPrivacidad error={e?.aviso_privacidad} />
        </div>
      </Grupo>

      <Enviar pendiente={pendiente} />
    </form>
  );
}
