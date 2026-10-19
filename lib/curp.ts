// Validación y lectura de la CURP. Se usa en el navegador (para completar la
// fecha y la entidad de nacimiento al escribir) y en el servidor (para validar).

const CODIGOS_ENTIDAD: Record<string, string> = {
  AS: "Aguascalientes",
  BC: "Baja California",
  BS: "Baja California Sur",
  CC: "Campeche",
  CL: "Coahuila",
  CM: "Colima",
  CS: "Chiapas",
  CH: "Chihuahua",
  DF: "Ciudad de México",
  DG: "Durango",
  GT: "Guanajuato",
  GR: "Guerrero",
  HG: "Hidalgo",
  JC: "Jalisco",
  MC: "México",
  MN: "Michoacán",
  MS: "Morelos",
  NT: "Nayarit",
  NL: "Nuevo León",
  OC: "Oaxaca",
  PL: "Puebla",
  QT: "Querétaro",
  QR: "Quintana Roo",
  SP: "San Luis Potosí",
  SL: "Sinaloa",
  SR: "Sonora",
  TC: "Tabasco",
  TS: "Tamaulipas",
  TL: "Tlaxcala",
  VZ: "Veracruz",
  YN: "Yucatán",
  ZS: "Zacatecas",
  NE: "Nacido en el Extranjero",
};

const FORMATO =
  /^[A-Z][AEIOUX][A-Z]{2}(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([HMX])(AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}([0-9A-Z])(\d)$/;

const ALFABETO = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

function digitoVerificador(curp17: string) {
  let suma = 0;
  for (let i = 0; i < 17; i++) suma += ALFABETO.indexOf(curp17[i]) * (18 - i);
  return (10 - (suma % 10)) % 10;
}

export type DatosCurp = {
  curp: string;
  fechaNacimiento: string; // AAAA-MM-DD
  sexo: "H" | "M" | "X";
  entidad: string;
};

export function normalizarCurp(valor: string) {
  return valor.trim().toUpperCase().replace(/\s+/g, "");
}

// Devuelve los datos de la CURP o null si no es válida
export function leerCurp(valor: string): DatosCurp | null {
  const curp = normalizarCurp(valor);
  const m = FORMATO.exec(curp);
  if (!m) return null;
  if (digitoVerificador(curp.slice(0, 17)) !== Number(curp[17])) return null;
  const [, aa, mm, dd, sexo, entidad, diferenciador] = m;
  // El carácter 17 es un dígito para nacidos antes del 2000 y una letra después
  const siglo = /\d/.test(diferenciador) ? 1900 : 2000;
  const anio = siglo + Number(aa);
  const fecha = new Date(Date.UTC(anio, Number(mm) - 1, Number(dd)));
  if (fecha.getUTCDate() !== Number(dd)) return null; // p. ej. 31 de febrero
  return {
    curp,
    fechaNacimiento: `${anio}-${mm}-${dd}`,
    sexo: sexo as DatosCurp["sexo"],
    entidad: CODIGOS_ENTIDAD[entidad],
  };
}

// DD/MM/AAAA <-> AAAA-MM-DD, como en el formulario anterior
export function fechaMx(iso: string) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

export function fechaIso(mx: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(mx.trim());
  if (!m) return null;
  const [, d, mes, a] = m;
  const fecha = new Date(Date.UTC(Number(a), Number(mes) - 1, Number(d)));
  if (fecha.getUTCDate() !== Number(d) || fecha.getUTCMonth() !== Number(mes) - 1) return null;
  return `${a}-${mes}-${d}`;
}

export function edadEn(fechaNacimiento: string, hoy = new Date()) {
  const [a, m, d] = fechaNacimiento.split("-").map(Number);
  let edad = hoy.getFullYear() - a;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) edad--;
  return edad;
}
