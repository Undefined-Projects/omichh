# OMICHH · Olimpiada Mexicana de Informática en Chihuahua

Sitio de la fase estatal de la OMI en Chihuahua: convocatorias, preregistro de
competidores y entrenadores, y panel del comité con tablas y gráficas.

## Correr en local

```bash
npm install
npm run dev            # http://localhost:3000
```

La base de datos es un archivo SQLite (`datos/omichh.db`) que se crea solo la
primera vez, con los 67 municipios y las 21 escuelas del catálogo anterior. La
carpeta `datos/` no se sube a git.

### Crear un administrador

```bash
npm run admin:crear -- correo@ejemplo.org "Nombre Apellido"
```

Pide la contraseña (mínimo 12 caracteres) sin mostrarla. Si el correo ya existe,
actualiza su contraseña. Después se entra en `/admin/entrar`.

## Qué hay

| Ruta | Qué es |
|---|---|
| `/preregistro/competidor` | Preregistro de estudiantes (mismos campos que la plataforma anterior) |
| `/preregistro/entrenador` | Preregistro de entrenadores, con catálogo de escuelas por municipio o propuesta de escuela nueva |
| `/aviso-de-privacidad` | **Borrador** del aviso de privacidad: debe revisarlo el comité |
| `/admin` | Resumen con cifras y gráficas (edad, escuela, municipio, concurso, nivel, sexo, semana…) |
| `/admin/competidores` | Tabla con búsqueda, filtros, cambio de estado y exportación a CSV |
| `/admin/entrenadores` | Tabla para validar o rechazar entrenadores |
| `/admin/escuelas` | Catálogo; las escuelas propuestas aparecen en el formulario al validarlas |

Piezas principales: `lib/db.ts` (esquema y conexión), `lib/acciones-preregistro.ts`
(validación de los formularios), `lib/sesion.ts` (acceso del comité),
`lib/datos-admin.ts` (consultas del panel), `lib/curp.ts` (validación de CURP),
`lib/catalogos.ts` (municipios, escuelas, títulos, entidades).

## Subir a Vercel (plan gratuito)

En Vercel el disco no persiste, así que la base no puede ser un archivo. El mismo
código se conecta a [Turso](https://turso.tech) (libSQL, tiene plan gratuito) con
dos variables de entorno:

1. Crea una base en Turso y genera un token.
2. En el proyecto de Vercel agrega `TURSO_DATABASE_URL` (`libsql://…`) y
   `TURSO_AUTH_TOKEN`.
3. Crea el primer administrador contra esa base desde tu computadora:

   ```bash
   TURSO_DATABASE_URL=libsql://… TURSO_AUTH_TOKEN=… npm run admin:crear -- correo@ejemplo.org "Nombre"
   ```

El esquema y los catálogos se crean solos en la primera visita.

## Otros comandos

```bash
npm run build      # compila para producción
npm run lint
npm run fondos     # regenera los mosaicos ASCII de public/fondos
```
