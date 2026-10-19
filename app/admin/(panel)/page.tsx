import { Suspense } from "react";
import { resumen } from "@/lib/datos-admin";
import { Barras, Cifra, Columnas, Linea, Tarjeta } from "../graficas";
import { Cargando, EncabezadoPanel } from "./piezas";

export default function Resumen() {
  return (
    <>
      <EncabezadoPanel titulo="Resumen" nota="Preregistros recibidos en el sitio, por escuela, edad, nivel y municipio." />
      <Suspense fallback={<Cargando />}>
        <Tablero />
      </Suspense>
    </>
  );
}

async function Tablero() {
  const d = await resumen();
  const t = d.totales;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Cifra valor={t.competidores} etiqueta="Competidores" nota={`${t.competidores_pendientes} por revisar`} />
        <Cifra valor={t.entrenadores} etiqueta="Entrenadores" nota={`${t.entrenadores_pendientes} por validar`} />
        <Cifra
          valor={t.escuelas}
          etiqueta="Escuelas validadas"
          nota={t.escuelas_propuestas === 1 ? "1 propuesta nueva" : `${t.escuelas_propuestas} propuestas nuevas`}
        />
        <Cifra valor={t.municipios} etiqueta="Municipios" nota="con al menos un preregistro (de 67)" />
      </div>

      <Tarjeta titulo="Preregistros por semana" nota="Competidores y entrenadores, últimas 26 semanas" datos={d.porSemana}>
        <Linea datos={d.porSemana} />
      </Tarjeta>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Tarjeta titulo="Competidores por edad" nota={`Edad cumplida hoy · ${t.cumplen_edad_omi} nacidos después del 1 de julio de 2007 (requisito OMI)`} datos={d.porEdad}>
          <Columnas datos={d.porEdad} unidad="años" />
        </Tarjeta>
        <Tarjeta titulo="Competidores por escuela" nota="Las 10 escuelas con más preregistros" datos={d.porEscuela}>
          <Barras datos={d.porEscuela} />
        </Tarjeta>
        <Tarjeta titulo="Competidores por municipio" nota="Los 10 municipios con más preregistros" datos={d.porMunicipio}>
          <Barras datos={d.porMunicipio} />
        </Tarjeta>
        <div className="grid gap-6">
          <Tarjeta titulo="Por concurso" datos={d.porConcurso}>
            <Barras datos={d.porConcurso} />
          </Tarjeta>
          <Tarjeta titulo="Por nivel escolar" datos={d.porNivel}>
            <Barras datos={d.porNivel} />
          </Tarjeta>
        </div>
        <Tarjeta titulo="Por sexo" nota="Según la CURP" datos={d.porSexo}>
          <Barras datos={d.porSexo} />
        </Tarjeta>
        <Tarjeta titulo="Estado de los preregistros" datos={d.porEstado}>
          <Barras datos={d.porEstado} />
        </Tarjeta>
        <Tarjeta titulo="Entidad de nacimiento" datos={d.porEntidad}>
          <Barras datos={d.porEntidad} />
        </Tarjeta>
        <Tarjeta titulo="Entrenadores por municipio" datos={d.entrenadoresPorMunicipio}>
          <Barras datos={d.entrenadoresPorMunicipio} />
        </Tarjeta>
        <Tarjeta titulo="Entrenadores por escuela" datos={d.entrenadoresPorEscuela} className="lg:col-span-2">
          <Barras datos={d.entrenadoresPorEscuela} />
        </Tarjeta>
      </div>
    </div>
  );
}
