// Contenido del sitio, migrado de https://omichh.org (octubre de 2026).

export const sitio = {
  nombre: "Olimpiada Mexicana de Informática en Chihuahua",
  siglas: "OMICHH",
  comite: "Comité Olímpico de Informática de Chihuahua (COMICHH)",
  convocan:
    "Gobierno del Estado de Chihuahua, Secretaría de Educación y Deporte y Olimpiada Mexicana de Informática Chihuahua (OMICHH)",
  correo: "olimpiadainformaticachihuahua@gmail.com",
  whatsapp: "526141909311",
  whatsappVisible: "+52 614 190 9311",
};

export const enlacesPlataforma = {
  preregistroEntrenador: "/preregistro/entrenador",
  preregistroCompetidor: "/preregistro/competidor",
  acceder: "/admin/entrar",
};

export const navegacion = [
  { href: "/que-es-la-omi", etiqueta: "¿Qué es la OMI?" },
  { href: "/convocatoria/omi", etiqueta: "OMI" },
  { href: "/convocatoria/omips", etiqueta: "OMIPS" },
  { href: "/bebras", etiqueta: "Bebras" },
  { href: "/competidores", etiqueta: "Competidores" },
  { href: "/entrenadores", etiqueta: "Entrenadores" },
  { href: "/delegacion-olimpica", etiqueta: "Delegación" },
];

export const queEsOmichh =
  "Es un concurso estatal diseñado para estudiantes que disfrutan resolver problemas usando lógica, pensamiento algorítmico y programación. No necesitas ser un experto en computadoras; basta con tener curiosidad, ganas de aprender y disposición para enfrentar retos. Los participantes destacados formarán parte de la delegación de Chihuahua para competir en la Olimpiada Mexicana de Informática a nivel nacional y, potencialmente, en competencias internacionales.";

export const queEsOmi =
  "La OMI es un concurso a nivel nacional para jóvenes con facilidad para resolver problemas prácticos mediante la lógica y el uso de computadoras. Su objetivo es promover el desarrollo tecnológico en México y encontrar a los mejores programadores, quienes formarán la selección mexicana para participar en las Olimpiadas Internacionales de Informática (IOI).";

export const objetivosOmi = [
  "Fomentar el interés por la informática y las ciencias de la computación entre estudiantes de nivel medio superior.",
  "Promover el desarrollo tecnológico en México.",
  "Encontrar jóvenes talentosos para apoyarlos en sus estudios y guiar sus inquietudes.",
  "Seleccionar a los mejores representantes de México para la IOI.",
  "Promover la amistad, convivencia e intercambio tecnológico entre jóvenes de todo el país.",
];

export const perfiles = [
  {
    titulo: "¿Eres alumno?",
    texto:
      "Si ya cuentas con un asesor o entrenador, comunícate con él para tu registro. Si no tienes asesor, realiza tu preregistro como competidor y te haremos llegar la información del proceso.",
    accion: { etiqueta: "Preregistro de competidor", href: enlacesPlataforma.preregistroCompetidor },
  },
  {
    titulo: "¿Eres profesor o entrenador?",
    texto:
      "Si es tu primera vez participando, realiza tu preregistro en línea. Verificaremos tu información y te contactaremos para activar tu cuenta en la plataforma.",
    accion: { etiqueta: "Preregistro de entrenador", href: enlacesPlataforma.preregistroEntrenador },
  },
];

export type Competencia = {
  siglas: string;
  nombre: string;
  nivel: string;
  descripcion: string;
  href: string;
  accion: string;
  estado: string;
};

export const competencias: Competencia[] = [
  {
    siglas: "OMI",
    nombre: "Olimpiada Mexicana de Informática",
    nivel: "Hasta media superior",
    descripcion:
      "Para estudiantes de secundaria y preparatoria: problemas algorítmicos complejos que requieren análisis, diseño de algoritmos eficientes y programación en C/C++.",
    href: "/convocatoria/omi",
    accion: "Ver convocatoria",
    estado: "Convocatoria 2026 cerrada",
  },
  {
    siglas: "OMIPS",
    nombre: "Olimpiada Mexicana de Informática para Primaria y Secundaria",
    nivel: "4.º de primaria a 2.º de secundaria",
    descripcion:
      "Se resuelve con Karel el Robot (ReKarel), que introduce la programación de forma visual e intuitiva desde edades tempranas.",
    href: "/convocatoria/omips",
    accion: "Ver convocatoria",
    estado: "Edición 2026 concluida",
  },
  {
    siglas: "Bebras",
    nombre: "Reto internacional de pensamiento computacional",
    nivel: "Todos los niveles",
    descripcion:
      "En línea y sin programar. Acertijos interactivos en español que desarrollan la resolución de problemas y el reconocimiento de patrones.",
    href: "/bebras",
    accion: "Conocer Bebras",
    estado: "Fechas 2026 próximamente",
  },
];

/* ---------- Convocatorias ---------- */

export type Hito = {
  fecha: string;
  titulo: string;
  detalle: string;
  realizado: boolean;
};

export type Seccion = {
  titulo: string;
  parrafos?: string[];
  lista?: string[];
  cierre?: string[];
};

export type Convocatoria = {
  clave: "omi" | "omips";
  siglas: string;
  titulo: string;
  edicion: string;
  estado: string;
  aviso: { titulo: string; texto: string; accion: string };
  resumen: string;
  hitos: string[];
  introduccion: string[];
  secciones: Seccion[];
  temario: { contenidos: string[]; entorno: { titulo: string; lista: string[] } };
  fechasEstatales: Hito[];
  fechasNacionales: Hito[];
};

const traslados: Seccion = {
  titulo: "Traslados",
  parrafos: [
    "En caso de requerirse traslados, los gastos de hospedaje, alimentación y transporte de las y los participantes no serán cubiertos por el COMI ni por el COMICHH.",
    "En caso de que las y los concursantes requieran acompañamiento, únicamente se aceptará la participación de algún profesor(a), asesor(a) o entrenador(a) autorizado(a) y vinculado(a) al proceso de la OMI o de la OMICHH.",
    "Tratándose de participantes menores de edad, el acompañante autorizado será responsable de su cuidado, supervisión y atención durante los traslados, la estancia y el desarrollo de las actividades presenciales relacionadas con el presente proceso.",
    "Los gastos de alimentación, hospedaje y transporte del acompañante tampoco serán cubiertos por el COMI ni por el COMICHH y, en todos los casos, deberán tramitarse ante la instancia correspondiente.",
    "Para tales efectos, el COMICHH podrá emitir las constancias y la documentación derivada del presente proceso que resulten necesarias para la realización de dichos trámites, sin que ello implique que la cobertura de tales gastos constituya una obligación para las entidades convocantes.",
  ],
};

const informacionAdicional: Seccion = {
  titulo: "Información adicional",
  parrafos: [
    "La convocatoria pública oficial, así como cualquier actualización relacionada con reglas, sedes, horarios, materiales y avisos complementarios, se dará a conocer a través del sitio oficial de la OMICHH: omichh.org.",
  ],
};

const notaImportante: Seccion = {
  titulo: "Nota importante",
  parrafos: [
    "En caso de que surjan situaciones, circunstancias o problemas no previstos en la presente convocatoria, el Comité Olímpico de Informática de Chihuahua (COMICHH) se reserva el derecho de adoptar las medidas que considere pertinentes para su debida atención y resolución.",
    "Dichas medidas podrán incluir, de manera enunciativa mas no limitativa, modificaciones en fechas, sedes o reglas de la competencia, cuando ello resulte necesario.",
    "En todos los casos, las decisiones que se tomen serán adoptadas con total imparcialidad, objetividad y sentido de justicia, velando por la equidad y el adecuado desarrollo de la competencia.",
  ],
};

const orientacion = `En caso de no contar con un maestro asesor, o si se requiere información adicional en calidad de asesor, se podrá solicitar orientación al correo ${sitio.correo}.`;

export const convocatorias: Record<"omi" | "omips", Convocatoria> = {
  omi: {
    clave: "omi",
    siglas: "OMI",
    titulo: "Olimpiada Mexicana de Informática (OMI) 2026",
    edicion: "31.ª edición estatal",
    estado: "Convocatoria cerrada",
    aviso: {
      titulo: "La convocatoria OMI 2026 ya cerró",
      texto:
        "El preregistro permanece abierto: las nuevas solicitudes se considerarán para las siguientes convocatorias.",
      accion: "Ir al preregistro",
    },
    resumen:
      "Dirigida a estudiantes de secundaria y bachillerato que disfrutan resolver problemas con lógica, algoritmos y programación.",
    hitos: ["Inscripciones cerradas", "Examen selectivo estatal realizado", "OMI Nacional 2026 realizada"],
    introduccion: [
      "El Gobierno del Estado de Chihuahua, a través de la Secretaría de Educación y Deporte y la Olimpiada Mexicana de Informática Chihuahua (OMICHH), convoca a estudiantes elegibles del Estado de Chihuahua a participar en la 31.ª Olimpiada Mexicana de Informática en su fase estatal 2026, proceso que permitirá seleccionar a las y los estudiantes que integrarán la delegación que representará a Chihuahua en la OMI Nacional 2026.",
      "La Olimpiada Mexicana de Informática en Chihuahua (OMICHH) es un concurso estatal dirigido a jóvenes con habilidad para resolver problemas prácticos mediante la lógica y la programación de computadoras. Su propósito es promover el interés por la informática y las ciencias de la computación, impulsar el desarrollo tecnológico y detectar a quienes cuenten con mayor talento para representar al estado en competencias nacionales y, posteriormente, internacionales.",
    ],
    secciones: [
      {
        titulo: "Requisitos y condiciones",
        parrafos: ["Podrán participar estudiantes que cumplan con lo siguiente:"],
        lista: [
          "Haber nacido después del 1 de julio de 2007.",
          "Tener nacionalidad mexicana o radicar en México y estar dispuesto a representar internacionalmente a México en caso de resultar elegible en etapas posteriores.",
          "Estar inscrito en una institución del sistema educativo mexicano con carga curricular completa.",
          "Estar cursando un grado tal que para el semestre enero-junio de 2027 aún se encuentre en nivel básico o medio superior.",
          "Tener gusto, habilidad y disposición para resolver problemas y retos mediante la lógica y la programación.",
          "Contar con conocimientos básicos de aritmética, álgebra y trigonometría.",
        ],
      },
      {
        titulo: "Inscripciones",
        parrafos: [
          "Las inscripciones iniciaron el 24 de abril de 2026 y finalizaron el 10 de septiembre de 2026.",
          "Los concursantes deberán registrarse a través de su asesor.",
          orientacion,
        ],
      },
      {
        titulo: "Sede oficial",
        parrafos: [
          "La sede oficial confirmada para las actividades presenciales de esta convocatoria es la Facultad de Contaduría y Administración de la UACH, ubicada en Circuito Universitario, Campus II, Chihuahua, Chih., México.",
        ],
      },
      {
        titulo: "Proceso estatal y selección",
        parrafos: [
          "El examen selectivo estatal determinará a las y los cuatro concursantes que integrarán la delegación de Chihuahua para participar en la OMI Nacional 2026.",
          "La coordinación estatal podrá considerar actividades complementarias de preparación y seguimiento académico para fortalecer el desempeño de la delegación.",
        ],
      },
      {
        titulo: "Evaluación",
        parrafos: [
          "Las evaluaciones consisten en resolver problemas de programación mediante código en C/C++.",
          "Cada problema será calificado con base en la corrección y eficiencia de la solución propuesta, conforme al sistema de evaluación utilizado por la coordinación estatal.",
          "Con base en los mejores resultados, se integrará la delegación oficial del estado de Chihuahua.",
        ],
      },
      traslados,
      informacionAdicional,
      notaImportante,
    ],
    temario: {
      contenidos: [
        "Bases del lenguaje C++: variables, tipos de datos, sentencias condicionales, ciclos, funciones y procedimientos.",
        "Estructuras de datos: arreglos, matrices, pilas, colas, listas y árboles.",
        "Algoritmos y técnicas de resolución: búsqueda binaria, barridos, cubetaje, greedy, recursividad y recorridos en grafos.",
        "Resolución de problemas en entorno de programación orientado a competencias.",
      ],
      entorno: {
        titulo: "Lenguaje y entorno",
        lista: [
          "Entorno de desarrollo para la fase estatal: Code::Blocks.",
          "Lenguaje autorizado: C/C++.",
          "Las actividades de preparación y seguimiento podrán realizarse mediante la plataforma omegaUp.",
          "En caso de que el COMICHH determine ajustes de plataforma o lineamientos técnicos adicionales, estos se comunicarán oportunamente por los medios oficiales de la OMICHH.",
        ],
      },
    },
    fechasEstatales: [
      { fecha: "17 abr 2026", titulo: "Publicación de la convocatoria estatal", detalle: "Difusión por medios oficiales de la OMICHH.", realizado: true },
      { fecha: "24 abr 2026", titulo: "Apertura de inscripciones", detalle: "Registro a través de asesor.", realizado: true },
      { fecha: "10 sep 2026", titulo: "Cierre de inscripciones", detalle: "Fecha límite para integrar participantes estatales.", realizado: true },
      { fecha: "12 sep 2026", titulo: "Examen selectivo estatal presencial", detalle: "De 9:30 a 15:00 horas en la Facultad de Contaduría y Administración de la UACH.", realizado: true },
      { fecha: "17 sep 2026", titulo: "Publicación de resultados estatales", detalle: "Fecha tentativa posterior a la corroboración de resultados.", realizado: true },
      { fecha: "Por confirmar", titulo: "Ceremonia de abanderamiento", detalle: "Para las y los seleccionados, una vez realizado el proceso de selección.", realizado: false },
    ],
    fechasNacionales: [
      { fecha: "9–12 oct 2026", titulo: "OMI Nacional 2026", detalle: "Sede: Universidad Politécnica Metropolitana de Hidalgo (UPMH), Pachuca, Hidalgo. Exámenes nacionales los días 10 y 11 de octubre.", realizado: true },
    ],
  },
  omips: {
    clave: "omips",
    siglas: "OMIPS",
    titulo: "Olimpiada Mexicana de Informática para Primaria y Secundaria (OMIPS) 2026",
    edicion: "11.ª edición estatal",
    estado: "Convocatoria cerrada",
    aviso: {
      titulo: "Edición 2026 concluida",
      texto:
        "El proceso de esta edición concluyó en junio de 2026. Si te interesa participar en la siguiente, deja tu preregistro general y te avisaremos en cuanto se publique la convocatoria 2027.",
      accion: "Quiero que me avisen de la próxima",
    },
    resumen:
      "Para estudiantes de primaria y secundaria; introduce el pensamiento computacional y la programación desde edades tempranas.",
    hitos: [
      "Inscripciones cerradas",
      "Examen selectivo estatal realizado",
      "Preselectivo nacional realizado",
      "Encuentro nacional realizado",
    ],
    introduccion: [
      "El Gobierno del Estado de Chihuahua, a través de la Secretaría de Educación y Deporte y la Olimpiada Mexicana de Informática Chihuahua (OMICHH), convoca a estudiantes del Estado de Chihuahua a participar en la 11.ª Olimpiada Mexicana de Informática para Primaria y Secundaria (OMIPS) 2026, proceso estatal que permitirá seleccionar a las y los participantes que representarán a Chihuahua en las etapas nacionales correspondientes.",
      "La OMIPS es un concurso nacional dirigido a estudiantes de educación básica con gusto y facilidad por resolver problemas prácticos mediante la lógica y el uso de computadoras. Su objetivo es promover el aprendizaje de las ciencias computacionales y preparar a las y los alumnos para futuras participaciones en la Olimpiada Mexicana de Informática.",
    ],
    secciones: [
      {
        titulo: "Criterio de elegibilidad",
        parrafos: ["Podrán participar estudiantes que cumplan con lo siguiente:"],
        lista: [
          "Estar inscritos en 4.º, 5.º o 6.º año de primaria, o en 1.º o 2.º año de secundaria, durante el ciclo escolar 2025-2026.",
          "No haber obtenido una medalla de oro en una edición pasada de la OMIPS.",
          "No haber participado en la fase nacional de alguna OMI categoría bachillerato en cualquier año anterior.",
          "Tener interés por la lógica, la programación y la resolución de problemas.",
        ],
      },
      {
        titulo: "Registro estatal",
        parrafos: [
          "Los concursantes deberán registrarse con la delegación estatal a través de su asesor.",
          orientacion,
        ],
      },
      {
        titulo: "Fase estatal en Chihuahua",
        parrafos: [
          "El comité estatal será responsable de definir y ejecutar el proceso para seleccionar a las y los 25 mejores alumnos como máximo del estado, quienes presentarán el examen de eliminatoria nacional. Para ello se realizará:",
        ],
        lista: [
          "Un examen estatal presencial.",
          "El registro formal de las y los clasificados por parte de la delegación estatal.",
        ],
      },
      {
        titulo: "Condiciones para la eliminatoria nacional",
        parrafos: ["Las y los participantes deberán observar las siguientes condiciones:"],
        lista: [
          "Haber obtenido un puntaje mayor a cero durante el proceso estatal.",
          "Estar registrados correctamente por la delegación estatal.",
          "Presentar el examen en la sede correspondiente.",
          "Grabar su pantalla durante las 4 horas del examen.",
          "Permitir que el salón sea grabado en video durante toda la aplicación.",
          "En sedes con más de un alumno, contar con un mecanismo de identificación visible para cada competidor.",
          "Aceptar que, en caso de irregularidades, el COMI podrá descalificar a alumnos o a toda la sede.",
          "Lo que la convocatoria nacional indique, como la hora y día que señale.",
        ],
      },
      {
        titulo: "Evaluación y clasificación",
        parrafos: [
          "Las evaluaciones consisten en resolver problemas de programación en ReKarel.",
          "Con base en los resultados de la fase estatal, se seleccionarán las y los 25 mejores alumnos de Chihuahua para la eliminatoria nacional en línea. El proceso de clasificación al examen nacional y la asignación de lugares se regirán por las reglas oficiales publicadas por la OMIPS 2026.",
          "La convocatoria nacional establece que se otorgarán reconocimientos digitales de participación a quienes obtengan puntos en el examen de eliminatoria.",
        ],
      },
      informacionAdicional,
      traslados,
      notaImportante,
    ],
    temario: {
      contenidos: [
        "Uso de instrucciones básicas.",
        "Uso de bifurcaciones condicionales.",
        "Uso de ciclos.",
        "Uso de condiciones para controlar el flujo.",
        "Uso de las instrucciones sucede y precede.",
        "Definición de instrucciones con parámetros.",
        "Recursividad con el objetivo de incrementar o decrementar una variable.",
        "Recursividad para contar, comparar cantidades o memorizar números.",
        "Búsquedas y resolución de problemas con enfoque algorítmico.",
      ],
      entorno: {
        titulo: "Lenguaje y plataforma",
        lista: [
          "Lenguaje de programación: Karel v2.0 (ReKarel).",
          "Eliminatoria nacional: se resolverá en la plataforma CMS, conforme a la convocatoria oficial de la OMIPS.",
        ],
      },
    },
    fechasEstatales: [
      { fecha: "17 abr 2026", titulo: "Publicación de la convocatoria estatal", detalle: "Difusión por medios oficiales de la OMICHH.", realizado: true },
      { fecha: "24 abr 2026", titulo: "Apertura de inscripciones", detalle: "Registro a través de asesor.", realizado: true },
      { fecha: "29 may 2026", titulo: "Cierre de inscripciones estatales", detalle: "Fecha límite para integrar participantes estatales.", realizado: true },
      { fecha: "6 jun 2026", titulo: "Examen estatal presencial", detalle: "Asignación de lugar 9:15 · inicio 9:30 (hora central) · 4 horas · Facultad de Contaduría y Administración de la UACH. Se seleccionan hasta 25 participantes.", realizado: true },
    ],
    fechasNacionales: [
      { fecha: "20 jun 2026", titulo: "Preselectivo nacional", detalle: "Eliminatoria en línea a las 10:30 (hora central), 4 horas, en Karel v2.0 (ReKarel) a través de la plataforma CMS.", realizado: true },
      { fecha: "9–12 oct 2026", titulo: "Encuentro nacional", detalle: "En sede nacional junto con la OMI Nacional.", realizado: true },
    ],
  },
};

/* ---------- Bebras ---------- */

export const bebras = {
  descripcion: [
    "Bebras es un reto internacional de pensamiento computacional que nació en Lituania y en el que actualmente participan más de 60 países. Consiste en aproximadamente 15 acertijos interactivos que se resuelven en 50 minutos desde computadoras o dispositivos móviles.",
    "Desarrolla habilidades como la resolución de problemas, la descomposición de tareas complejas y el reconocimiento de patrones. No requiere saber programar, es completamente en línea, en español y sin costo.",
  ],
  cifras: [
    { valor: "+60", etiqueta: "Países" },
    { valor: "~15", etiqueta: "Acertijos" },
    { valor: "50", etiqueta: "Minutos" },
    { valor: "$0", etiqueta: "Sin costo" },
  ],
  aviso:
    "Las fechas de Bebras 2026 se publicarán próximamente. Mientras tanto, puedes preregistrarte para recibir información.",
};

/* ---------- Competidores aceptados 2026 ---------- */

export const competidores = {
  titulo: "Competidores · Convocatoria 2026",
  descripcion: "Listado de competidores aceptados en la Olimpiada Mexicana de Informática en Chihuahua.",
  criterio: "Nació después del 01/07/2007",
  lista: [
    { nombre: "Anna Victoria Bonilla Chacón", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Agropecuario No 90", nivel: "Media superior" },
    { nombre: "Sofía Isabel Caldera Herrera", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122", nivel: "Media superior" },
    { nombre: "Carlos David Camarena Portillo", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122", nivel: "Media superior" },
    { nombre: "Judith Cerrato González", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Agropecuario No 90", nivel: "Media superior" },
    { nombre: "Iván Uzziel España Salcedo", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Agropecuario No 90", nivel: "Media superior" },
    { nombre: "Andrea Sofía Garay González", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Agropecuario No 90", nivel: "Media superior" },
    { nombre: "Santiago Jordan Hernández", concurso: "OMI", escuela: "Escuela Secundaria Estatal 3013", nivel: "Secundaria" },
    { nombre: "Fernanda Medina", concurso: "OMI", escuela: "Colegio de Bachilleres del Estado de Chihuahua Plantel 7", nivel: "Media superior" },
    { nombre: "Jaime Peña Balderrama", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122", nivel: "Media superior" },
    { nombre: "Diana María Prieto Tovar", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122", nivel: "Media superior" },
    { nombre: "Jorge Damian Reyes Agüero", concurso: "OMI", escuela: "Preparatoria del Instituto Tecnológico y de Estudios Superiores de Monterrey", nivel: "Media superior" },
    { nombre: "Jesús Roberto Terrazas Torres", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122", nivel: "Media superior" },
    { nombre: "Victoria Sarahy Valverde Coronado", concurso: "OMI", escuela: "Colegio de Bachilleres del Estado de Chihuahua Plantel 7", nivel: "Media superior" },
    { nombre: "Yael Villalobos Marrufo", concurso: "OMI", escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122", nivel: "Media superior" },
  ],
};

/* ---------- Entrenadores y escuelas ---------- */

export const escuelasConEntrenador = [
  {
    escuela: "Centro de Bachillerato Tecnológico Agropecuario No 90",
    ciudad: "Cuauhtémoc",
    nivel: "Media superior",
    entrenadores: [{ nombre: "Mario Héctor Valenzuela Trujillo", ciudad: "Madera" }],
  },
  {
    escuela: "Centro de Bachillerato Tecnológico Industrial y de Servicios 122",
    ciudad: "Chihuahua",
    nivel: "Media superior",
    entrenadores: [{ nombre: "Jorge Fernández Quezada", ciudad: "Chihuahua" }],
  },
  {
    escuela: "Colegio de Bachilleres del Estado de Chihuahua Plantel 7",
    ciudad: "Juárez",
    nivel: "Media superior",
    entrenadores: [{ nombre: "Claudia Abril Rodríguez Porras", ciudad: "Juárez" }],
  },
  {
    escuela: "Escuela Secundaria Estatal 3013",
    ciudad: "Chihuahua",
    nivel: "Secundaria",
    entrenadores: [{ nombre: "Rocío Zea Rico", ciudad: "Chihuahua" }],
  },
  {
    escuela: "Parque Tecnológico Orión",
    ciudad: "Chihuahua",
    nivel: "Media superior",
    entrenadores: [{ nombre: "Alberto Márquez Escamilla", ciudad: "Chihuahua" }],
  },
  {
    escuela: "PrepaTec",
    ciudad: "Chihuahua",
    nivel: "Media superior",
    entrenadores: [{ nombre: "Antonio Alan Varela Domínguez", ciudad: "Chihuahua" }],
  },
];

/* ---------- Delegación olímpica ---------- */

export const delegacion = {
  descripcion:
    "Equipo de liderazgo de la delegación estatal que coordina la participación de Chihuahua en la OMI, OMIPS y procesos relacionados.",
  delegado: {
    nombre: "Dr. José Francisco Aldrete Enríquez",
    cargo: "Delegado OMICHH",
    enlaces: [
      { etiqueta: "WhatsApp", href: "https://wa.me/526141909311" },
      { etiqueta: "Telegram", href: "https://t.me/FcoAldrete" },
      { etiqueta: "Página personal", href: "https://aldrete.mx/" },
      { etiqueta: "Página de autor", href: "https://aldrete.mx/autor.php" },
      { etiqueta: "Google Académico", href: "https://scholar.google.com/citations?hl=es&user=WhHZF64AAAAJ&view_op=list_works" },
      { etiqueta: "ORCID", href: "https://orcid.org/0000-0002-8936-8658" },
      { etiqueta: "Facebook", href: "https://www.facebook.com/fcoalderete" },
      { etiqueta: "Instagram", href: "https://www.instagram.com/fcoalderete" },
      { etiqueta: "X / Twitter", href: "https://x.com/FcoAlderete" },
      { etiqueta: "TikTok", href: "https://www.tiktok.com/@fcoalderete" },
      { etiqueta: "LinkedIn", href: "https://www.linkedin.com/in/fcoalderete" },
    ],
  },
  lideres: [
    { nombre: "Ing. Mario H. Valenzuela Trujillo", cargo: "Líder OMI" },
    { nombre: "Lic. Rocío Zea Rico", cargo: "Líder OMIPS" },
  ],
  comite: [
    "Alberto Márquez Escamilla",
    "Jaime Humberto Borunda Lara",
    "Sergio Félix López Ávila",
    "Juan Javier Gutiérrez García",
    "Arturo Roberto Medina Santillanes",
    "Pablo Alejandro Alvarez Trenti",
  ],
};

/* ---------- Preregistro ---------- */

export const preregistro = [
  {
    titulo: "Soy entrenador / profesor",
    texto: "Realiza tu preregistro. Validaremos tu información y te contactaremos para activar tu cuenta.",
    accion: { etiqueta: "Preregistro de entrenador", href: enlacesPlataforma.preregistroEntrenador },
    datos: [
      "Nombre completo y título (opcional, para constancias)",
      "CURP",
      "Correo electrónico y celular",
      "Municipio de residencia",
      "Escuela (del catálogo o como propuesta nueva)",
      "Usuario de omegaUp (opcional)",
    ],
  },
  {
    titulo: "Soy competidor",
    texto:
      "Puedes preregistrarte aunque no tengas asesor. Si ya tienes uno, contáctalo directamente para que complete tu registro oficial.",
    accion: { etiqueta: "Preregistro de competidor", href: enlacesPlataforma.preregistroCompetidor },
    datos: [
      "Concurso de interés: OMI, OMIPS o preregistro general",
      "Nombre completo y CURP",
      "Fecha y entidad de nacimiento",
      "Correo electrónico y celular",
      "Escuela, nivel y año escolar",
      "Municipio de residencia",
    ],
  },
  {
    titulo: "Buscar entrenador",
    texto: "Consulta el directorio oficial de entrenadores y las escuelas donde participan.",
    accion: { etiqueta: "Ver entrenadores y escuelas", href: "/entrenadores" },
    datos: [],
  },
];

/* ---------- Inicio ---------- */

export const recursos = [
  {
    nombre: "omegaUp",
    descripcion: "Plataforma de preparación y seguimiento de la OMI: problemas en español, cursos y concursos.",
    href: "https://omegaup.com",
  },
  {
    nombre: "Karel",
    descripcion: "Entorno de Karel el Robot en omegaUp para practicar la OMIPS.",
    href: "https://omegaup.com/karel.js/",
  },
  {
    nombre: "Code::Blocks",
    descripcion: "Entorno de desarrollo C/C++ que se usa en la fase estatal de la OMI.",
    href: "https://www.codeblocks.org",
  },
  {
    nombre: "OMI nacional",
    descripcion: "Sitio oficial de la Olimpiada Mexicana de Informática.",
    href: "https://www.olimpiadadeinformatica.org.mx",
  },
];

export const noticias = [
  {
    fecha: "9–12 oct 2026",
    titulo: "Chihuahua en la OMI Nacional 2026",
    resumen:
      "La delegación compitió en la Universidad Politécnica Metropolitana de Hidalgo, en Pachuca, junto con el encuentro nacional de la OMIPS.",
  },
  {
    fecha: "12 sep 2026",
    titulo: "Examen selectivo estatal de la OMI",
    resumen:
      "Se realizó en la Facultad de Contaduría y Administración de la UACH para definir a las y los cuatro integrantes de la delegación.",
  },
  {
    fecha: "20 jun 2026",
    titulo: "Preselectivo nacional de la OMIPS",
    resumen:
      "Hasta 25 estudiantes de Chihuahua presentaron la eliminatoria nacional en línea, resolviendo problemas con ReKarel.",
  },
];

export const preguntas = [
  {
    pregunta: "¿Necesito saber programar?",
    respuesta:
      "No necesitas ser un experto en computadoras: basta con curiosidad y ganas de aprender. La OMIPS introduce la programación con Karel el Robot, y Bebras se resuelve sin programar.",
  },
  {
    pregunta: "¿Cómo me inscribo?",
    respuesta:
      "Los concursantes se registran a través de su asesor. Si no tienes asesor, haz tu preregistro como competidor o escribe a olimpiadainformaticachihuahua@gmail.com y te orientamos.",
  },
  {
    pregunta: "¿Qué lenguajes se usan?",
    respuesta:
      "En la OMI se programa en C/C++ con Code::Blocks durante la fase estatal, y la preparación se hace en omegaUp. En la OMIPS se usa Karel v2.0 (ReKarel).",
  },
  {
    pregunta: "¿Quién puede participar en la OMI?",
    respuesta:
      "Estudiantes nacidos después del 1 de julio de 2007, inscritos en el sistema educativo mexicano y que para enero-junio de 2027 sigan en nivel básico o medio superior. Consulta todos los requisitos en la convocatoria.",
  },
  {
    pregunta: "¿Dónde son las actividades presenciales?",
    respuesta:
      "En la Facultad de Contaduría y Administración de la UACH, Circuito Universitario, Campus II, Chihuahua, Chih.",
  },
  {
    pregunta: "¿Se cubren los gastos de traslado?",
    respuesta:
      "No. Hospedaje, alimentación y transporte no los cubren el COMI ni el COMICHH, aunque el COMICHH puede emitir constancias para gestionarlos ante la instancia correspondiente.",
  },
];
