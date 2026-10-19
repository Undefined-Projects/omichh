import type { Metadata } from "next";
import { CabeceraPagina } from "@/app/componentes";
import { ListaAscii } from "@/app/(sitio)/convocatoria/pagina-convocatoria";
import { sitio } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo la OMICHH recaba, usa y protege los datos personales del preregistro.",
};

// BORRADOR: debe revisarlo el comité o un abogado antes de considerarse definitivo.
const secciones: { titulo: string; parrafos?: string[]; lista?: string[] }[] = [
  {
    titulo: "Responsable",
    parrafos: [
      `El ${sitio.comite}, a través de la ${sitio.nombre} (${sitio.siglas}), es responsable del tratamiento de los datos personales que se recaban en este sitio. Domicilio: [pendiente de definir por el comité]. Contacto: ${sitio.correo}.`,
    ],
  },
  {
    titulo: "Datos personales que recabamos",
    parrafos: ["A través de los formularios de preregistro recabamos:"],
    lista: [
      "Identificación: nombre(s), apellidos, CURP, fecha, entidad de nacimiento y sexo (estos tres últimos se obtienen de la CURP) y, en el caso de entrenadores, título o tratamiento.",
      "Contacto: correo electrónico, número de celular, teléfono, municipio y estado de residencia.",
      "Escolares: escuela, nivel y año escolar; en el caso de entrenadores, la escuela en la que participan y, opcionalmente, su usuario de omegaUp.",
      "Los comentarios que decidas compartirnos.",
    ],
  },
  {
    titulo: "Datos de menores de edad",
    parrafos: [
      "Muchas personas participantes son menores de edad. Su preregistro debe realizarse con el conocimiento y la autorización de su madre, padre o tutor, quien puede ejercer en su nombre los derechos descritos en este aviso.",
    ],
  },
  {
    titulo: "Finalidades",
    parrafos: ["Usamos tus datos para:"],
    lista: [
      "Organizar las etapas estatales de la OMI, la OMIPS y Bebras: registro, verificación de requisitos (como la edad y el nivel escolar), aplicación de exámenes y publicación de resultados.",
      "Contactarte a ti o a tu entrenador con información del proceso y de próximas convocatorias.",
      "Registrar ante el Comité Mexicano de Informática (COMI) a quienes integren la delegación de Chihuahua.",
      "Emitir constancias y reconocimientos.",
      "Elaborar estadísticas de participación (por municipio, escuela, nivel o edad) que se presentan sin identificar a ninguna persona.",
    ],
  },
  {
    titulo: "Publicación y transferencias",
    parrafos: [
      "El nombre, la escuela y el nivel de las personas aceptadas en cada convocatoria pueden publicarse en este sitio. Para cumplir las finalidades anteriores, tus datos pueden compartirse con el Comité Mexicano de Informática, con la Secretaría de Educación y Deporte del Estado de Chihuahua y con la sede de las actividades presenciales. No vendemos ni compartimos tus datos con fines comerciales.",
    ],
  },
  {
    titulo: "Derechos ARCO y revocación del consentimiento",
    parrafos: [
      `Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento, así como revocar tu consentimiento, escribiendo a ${sitio.correo} con tu nombre, tu CURP y la solicitud que deseas realizar. Te responderemos por el mismo medio.`,
    ],
  },
  {
    titulo: "Seguridad y conservación",
    parrafos: [
      "Solo el personal autorizado del comité puede consultar los preregistros, mediante un acceso protegido con contraseña. Conservamos los datos mientras sean necesarios para las finalidades descritas y los eliminamos después.",
    ],
  },
  {
    titulo: "Cambios a este aviso",
    parrafos: ["Cualquier cambio a este aviso de privacidad se publicará en esta misma página."],
  },
];

export default function AvisoDePrivacidad() {
  return (
    <>
      <CabeceraPagina antetitulo="OMICHH · Datos personales" titulo="Aviso de privacidad" />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="mb-12 rounded-2xl border-2 border-dashed border-naranja bg-arena-50 p-5 font-mono text-xs uppercase tracking-wider text-ladrillo">
          [!] Versión preliminar, sujeta a revisión del comité. Última actualización: octubre de 2026.
        </p>
        {secciones.map((s, i) => (
          <section key={s.titulo} className="mt-10 first-of-type:mt-0">
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold">
              <span className="font-mono text-sm font-normal text-ladrillo">{String(i + 1).padStart(2, "0")}</span>
              {s.titulo}
            </h2>
            <div className="mt-3 space-y-3 text-tinta-suave">
              {s.parrafos?.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              {s.lista && <ListaAscii elementos={s.lista} />}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
