# FULLMINDTECH

## Base Node TS

Proyecto base para aplicaciones Node.js con TypeScript, Express y TypeORM, orientado a buenas prácticas, escalabilidad y mantenibilidad.

## Estructura de Carpetas

```
base-node-ts/
├── src/
│   ├── entry-dev.ts          # Usado en desarrollo con ts-node
│   ├── entry-prod.ts         # Usado en producción con module-alias
│   ├── app.ts                # Configuración principal de la app Express
│   ├── server.ts             # Arranque del servidor y conexión a la base de datos
│   ├── data-source.ts        # Configuración de TypeORM y conexión a la base de datos
│   ├── middleware/           # Middlewares personalizados (errores, validación)
│   ├── routes/               # Rutas principales de la API
│   ├── schemas/              # Esquemas de validación (zod)
│   ├── types/                # Tipos y contratos de la API
│   ├── utils/                # Utilidades generales (logger, helpers)
│   └── users/                # Módulo de usuarios (MVC)
│       ├── controllers/      # Controladores de usuarios
│       ├── dtos/             # DTOs y esquemas de validación
│       ├── models/           # Entidades de TypeORM
│       ├── repositories/     # Acceso a datos
│       ├── routes/           # Rutas de usuarios
│       └── services/         # Lógica de negocio
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
├── .eslintrc.json            # Configuración de ESLint
├── .prettierrc               # Configuración de Prettier
└── README.md                 # Documentación
```

## Arquitectura

- **MVC modularizado**: Cada recurso (ej: usuarios) tiene su propio módulo con controladores, servicios, repositorios, modelos y rutas.
- **Express** como framework HTTP.
- **TypeORM** para acceso y gestión de base de datos (PostgreSQL).
- **Validación** con Zod y middlewares personalizados.
- **Logger** con Winston (configurado para consola, sin archivos).
- **Separación de middlewares** para validación y manejo de errores.
- **Soporte para alias de rutas (`@/`)**: Alias configurados para imports limpios y mantenibles, usando `tsconfig-paths` en desarrollo y `module-alias` en producción.

## Principales Librerías

- [express](https://expressjs.com/): Framework web.
- [typeorm](https://typeorm.io/): ORM para TypeScript/Node.js.
- [zod](https://zod.dev/): Validación de esquemas y datos.
- [winston](https://github.com/winstonjs/winston): Logger flexible.
- [helmet](https://helmetjs.github.io/): Seguridad HTTP.
- [cors](https://github.com/expressjs/cors): CORS middleware.
- [compression](https://github.com/expressjs/compression): Compresión HTTP.
- [dotenv](https://github.com/motdotla/dotenv): Variables de entorno.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js): Hash de contraseñas.
- [tsconfig-paths](https://github.com/dividab/tsconfig-paths): Soporte para aliases en tiempo de desarrollo con ts-node.
- [module-alias](https://github.com/ilearnio/module-alias): Resolución de imports con alias en tiempo de ejecución (producción).

## Comandos Útiles

- `npm run dev`        - Levanta el servidor en modo desarrollo con recarga automática.
- `npm run build`      - Compila el proyecto a JavaScript en la carpeta `dist`.
- `npm start`          - Ejecuta el servidor en modo producción (desde `dist`).
- `npm run test`       - Ejecuta los tests (Jest).
- `npm run lint`       - Linting del código con ESLint.
- `npm run format`     - Formatea el código con Prettier.
- `npm run migration:generate` - Genera una nueva migración de base de datos.
- `npm run migration:run`      - Ejecuta las migraciones pendientes.
- `npm run migration:revert`   - Revierte la última migración.

## Módulos Principales

### src/app.ts
Configura middlewares globales, logging, rutas y manejo de errores.

### src/server.ts
Arranca el servidor, aplica middlewares de seguridad y gestiona la conexión/cierre de la base de datos.

### src/data-source.ts
Configura y exporta la instancia de TypeORM para conexión a PostgreSQL.

### src/users/
Módulo de usuarios con estructura MVC:
- **controllers/**: Lógica de entrada/salida HTTP.
- **services/**: Lógica de negocio y validaciones complejas.
- **repositories/**: Acceso a datos y consultas a la base.
- **models/**: Entidades de TypeORM.
- **dtos/**: Esquemas de validación y tipos de datos.
- **routes/**: Endpoints RESTful para usuarios.

### src/middleware/
- **error.middleware.ts**: Manejo centralizado de errores.
- **validation.middleware.ts**: Validación de datos de entrada usando Zod.

### src/utils/
- **logger.ts**: Logger centralizado con Winston (solo consola).
- **api.utils.ts**: Helpers para respuestas estándar de API.

## Variables de Entorno

Configura un archivo `.env` con las variables definidas en el archivo `.env.example`

## 🧩 Soporte para Alias de Rutas

El proyecto está configurado para usar **aliases `@/`** en los imports, permitiendo rutas limpias y evitando el uso de imports relativos largos (`../../../`).

### Configuración

- En `tsconfig.json`:

```jsonc
{
  ...
  "baseUrl": "./src",
  "paths": {
    "@/*": ["*"]
  }
}
```

- En `package.json`:

```jsonc
{
  ...
  "_moduleAliases": {
    "@": "dist"
  }
}
```

## Notas
- El proyecto está preparado para escalar agregando nuevos módulos siguiendo la misma estructura que `users`.
- Se recomienda mantener la separación de responsabilidades y seguir las buenas prácticas de tipado y validación.

---
