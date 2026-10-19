"use client";

import { useActionState, useState } from "react";
import { preregistrarEntrenador, type EstadoFormulario } from "@/lib/acciones-preregistro";
import { MUNICIPIOS, NIVELES_ESCUELA, TITULOS } from "@/lib/catalogos";
import { fechaMx, leerCurp } from "@/lib/curp";
import { aria, AvisoPrivacidad, Campo, Enviar, estiloControl, Exito, Grupo, Trampa } from "./campos";

export type EscuelaCatalogo = { id: number; nombre: string; municipioId: number };

export function FormularioEntrenador({ escuelas }: { escuelas: EscuelaCatalogo[] }) {
  const [estado, accion, pendiente] = useActionState<EstadoFormulario, FormData>(preregistrarEntrenador, {});
  const v = estado.valores ?? {};
  const e = estado.errores;

  const [titulo, setTitulo] = useState(v.titulo ?? "");
  const [curp, setCurp] = useState(v.curp ?? "");
  const [municipio, setMunicipio] = useState(v.municipio_id ?? "");
  const [mismoMunicipio, setMismoMunicipio] = useState(v.sincronizar_municipio !== undefined ? v.sincronizar_municipio === "1" : true);
  const [municipioEscuela, setMunicipioEscuela] = useState(v.escuela_municipio_id ?? "");
  const [opcion, setOpcion] = useState(v.escuela_opcion ?? "listado");

  if (estado.ok) return <Exito mensaje={estado.mensaje ?? "Recibimos tu preregistro."} />;

  const datosCurp = leerCurp(curp);
  const municipioDeEscuela = mismoMunicipio ? municipio : municipioEscuela;
  const escuelasDelMunicipio = escuelas.filter((x) => String(x.municipioId) === municipioDeEscuela);

  return (
    <form action={accion} className="relative space-y-8" noValidate>
      <Trampa />
      {estado.mensaje && (
        <p role="alert" className="rounded-xl border-2 border-ladrillo bg-arena-50 px-4 py-3 text-ladrillo">
          {estado.mensaje}
        </p>
      )}

      <Grupo titulo="Datos del entrenador">
        <Campo nombre="titulo" etiqueta="Título o tratamiento" ayuda="Se usará en constancias y reconocimientos. Puedes dejarlo en blanco si prefieres no usar tratamiento." error={e?.titulo}>
          <select {...aria("titulo", e)} value={titulo} onChange={(x) => setTitulo(x.target.value)} className={estiloControl}>
            <option value="">Sin título</option>
            {TITULOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value="__otro__">Otro</option>
          </select>
        </Campo>
        {titulo === "__otro__" ? (
          <Campo nombre="titulo_otro" etiqueta="Especifica el título" ayuda="Solo si elegiste “Otro” (máximo 15 caracteres)." error={e?.titulo_otro} requerido>
            <input {...aria("titulo_otro", e)} defaultValue={v.titulo_otro} maxLength={15} className={estiloControl} />
          </Campo>
        ) : (
          <div className="hidden sm:block" />
        )}

        <Campo nombre="nombres" etiqueta="Nombre(s)" error={e?.nombres} requerido>
          <input {...aria("nombres", e)} defaultValue={v.nombres} autoComplete="given-name" required className={estiloControl} />
        </Campo>
        <Campo nombre="apellido_paterno" etiqueta="Apellido paterno" error={e?.apellido_paterno} requerido>
          <input {...aria("apellido_paterno", e)} defaultValue={v.apellido_paterno} required className={estiloControl} />
        </Campo>
        <Campo nombre="apellido_materno" etiqueta="Apellido materno" error={e?.apellido_materno}>
          <input {...aria("apellido_materno", e)} defaultValue={v.apellido_materno} className={estiloControl} />
        </Campo>
        <Campo nombre="curp" etiqueta="CURP" error={e?.curp} requerido
          ayuda={datosCurp ? `Nacimiento ${fechaMx(datosCurp.fechaNacimiento)} · ${datosCurp.entidad} · sexo ${datosCurp.sexo}` : "El sexo, la fecha y la entidad de nacimiento se obtendrán automáticamente de tu CURP."}>
          <input {...aria("curp", e)} value={curp} onChange={(x) => setCurp(x.target.value.toUpperCase())} maxLength={18} required autoCapitalize="characters" className={`${estiloControl} font-mono uppercase`} />
        </Campo>
        <Campo nombre="correo" etiqueta="Correo electrónico" error={e?.correo} requerido>
          <input {...aria("correo", e)} type="email" defaultValue={v.correo} autoComplete="email" required className={estiloControl} />
        </Campo>
        <Campo nombre="celular" etiqueta="Número de celular" error={e?.celular} requerido>
          <input {...aria("celular", e)} type="tel" inputMode="numeric" defaultValue={v.celular} autoComplete="tel" required className={estiloControl} />
        </Campo>
        <Campo nombre="municipio_id" etiqueta="Municipio de residencia" error={e?.municipio_id} requerido>
          <select {...aria("municipio_id", e)} value={municipio} onChange={(x) => setMunicipio(x.target.value)} required className={estiloControl}>
            <option value="">Selecciona...</option>
            {MUNICIPIOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo nombre="usuario_omegaup" etiqueta="Usuario de omegaUp (campo opcional)" error={e?.usuario_omegaup}>
          <input {...aria("usuario_omegaup", e)} defaultValue={v.usuario_omegaup} className={estiloControl} />
        </Campo>
      </Grupo>

      <Grupo titulo="Datos de la escuela">
        <p className="text-sm text-tinta-suave sm:col-span-2">
          Primero busca tu escuela por municipio. Si no aparece, preregístrala como propuesta para que el administrador la
          valide.
        </p>
        <Campo nombre="escuela_municipio_id" etiqueta="Municipio de la escuela" error={e?.escuela_municipio_id} requerido>
          {mismoMunicipio && <input type="hidden" name="escuela_municipio_id" value={municipio} />}
          <select
            {...aria("escuela_municipio_id", e)}
            name={mismoMunicipio ? undefined : "escuela_municipio_id"}
            value={municipioDeEscuela}
            disabled={mismoMunicipio}
            onChange={(x) => setMunicipioEscuela(x.target.value)}
            className={`${estiloControl} disabled:opacity-70`}
          >
            <option value="">Selecciona...</option>
            {MUNICIPIOS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <div className="flex flex-col justify-center gap-1">
          <label className="flex items-center gap-3">
            <input type="hidden" name="sincronizar_municipio" value={mismoMunicipio ? "1" : "0"} />
            <input
              type="checkbox"
              checked={mismoMunicipio}
              onChange={(x) => {
                setMismoMunicipio(x.target.checked);
                if (!x.target.checked) setMunicipioEscuela(municipio);
              }}
              className="size-5 accent-naranja"
            />
            <span>La escuela está en mi municipio de residencia</span>
          </label>
          <p className="pl-8 text-xs text-tinta-suave">Desmarca esta opción si tu escuela está en otro municipio.</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 sm:col-span-2" role="radiogroup" aria-label="¿Tu escuela aparece en el listado?">
          {[
            ["listado", "Mi escuela aparece en el listado"],
            ["nueva", "Mi escuela no aparece"],
          ].map(([valor, etiqueta]) => (
            <label key={valor} className="flex items-center gap-2.5">
              <input type="radio" name="escuela_opcion" value={valor} checked={opcion === valor} onChange={() => setOpcion(valor)} className="size-4 accent-naranja" />
              {etiqueta}
            </label>
          ))}
        </div>

        {opcion === "listado" ? (
          <Campo nombre="escuela_id" etiqueta="Escuela" error={e?.escuela_id} requerido className="sm:col-span-2"
            ayuda={municipioDeEscuela && escuelasDelMunicipio.length === 0 ? "No hay escuelas registradas en ese municipio." : undefined}>
            <select {...aria("escuela_id", e)} defaultValue={v.escuela_id} key={municipioDeEscuela} className={estiloControl}>
              <option value="">Selecciona una escuela...</option>
              {escuelasDelMunicipio.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nombre}
                </option>
              ))}
            </select>
          </Campo>
        ) : (
          <>
            <Campo nombre="escuela_nombre" etiqueta="Nombre completo de la escuela" error={e?.escuela_nombre} requerido className="sm:col-span-2">
              <input {...aria("escuela_nombre", e)} defaultValue={v.escuela_nombre} className={estiloControl} />
            </Campo>
            <Campo nombre="escuela_nombre_corto" etiqueta="Nombre corto de la escuela" error={e?.escuela_nombre_corto}>
              <input {...aria("escuela_nombre_corto", e)} defaultValue={v.escuela_nombre_corto} className={estiloControl} />
            </Campo>
            <Campo nombre="escuela_nivel" etiqueta="Nivel educativo" error={e?.escuela_nivel} requerido>
              <select {...aria("escuela_nivel", e)} defaultValue={v.escuela_nivel ?? ""} className={estiloControl}>
                <option value="">Selecciona...</option>
                {NIVELES_ESCUELA.map((n) => (
                  <option key={n.valor} value={n.valor}>
                    {n.etiqueta}
                  </option>
                ))}
              </select>
            </Campo>
          </>
        )}
        <p className="text-xs text-tinta-suave sm:col-span-2">
          Captura por ahora una sola escuela. Cuando ingreses a la plataforma podrás agregar más escuelas a tu perfil si
          tienes competidores de otras instituciones.
        </p>
      </Grupo>

      <AvisoPrivacidad error={e?.aviso_privacidad} />
      <Enviar pendiente={pendiente} />
    </form>
  );
}
