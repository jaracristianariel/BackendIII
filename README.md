# ShipNow API

API de logística/envíos construida con **Node.js + Express + MongoDB (Mongoose)**, desarrollada como proyecto del curso **Backend 3 de CoderHouse**.

El proyecto arrancó como una base didáctica con malas prácticas a propósito, y se fue refactorizando módulo a módulo hacia una **arquitectura profesional por capas** (Router → Controller → Service → Repository → Model), con manejo centralizado de errores, logging, documentación interactiva, testing automatizado y carga de archivos.

## Entidades

- **User** (cliente): `first_name`, `last_name`, `email`, `password`, `role` (`user` / `admin` / `courier`), `documents` (metadatos de archivos subidos).
- **Product**: `name`, `price`, `stock`, `status` (`available` / `out_of_stock`).
- **Courier** (repartidor): `name`, `zone`, `available`.
- **Order** (pedido): `customerName`, `customer` (ref a User), `address`, `weight`, `cost` (calculado: `weight * 10`), `status` (`pending` / `in_transit` / `delivered`), `priority` (`normal` / `high`), `items`, `courierId`, `receipt` (metadatos del comprobante).
- **Delivery** (entrega): `orderId` (ref a Order), `courierId` (ref a Courier), `status` (`assigned` / `in_transit` / `delivered`), `assignedAt`, `receipt` (metadatos del comprobante).

## Cómo correrlo localmente

Requisitos: Node.js y un cluster de MongoDB (Atlas o local).

```bash
# 1. Instalar dependencias
npm install

# 2. Crear tu archivo de variables de entorno a partir del ejemplo
cp .env.example .env
# completá PORT, SECRET y MONGODB_URI con tus datos reales

# 3. Levantar el servidor
npm run dev
```

El servidor queda escuchando en `http://localhost:8080` (o el puerto que hayas puesto en `.env`).

### Correr los tests

Los tests usan un entorno y una base de datos **separados** de los de desarrollo:

```bash
cp .env.test.example .env.test
# completá MONGODB_URI con una base de testing distinta a la de desarrollo

npm test
```

### Documentación interactiva (Swagger)

Con el servidor corriendo, entrá a `http://localhost:8080/api/docs` para ver y probar todos los endpoints desde el navegador.

## Endpoints principales

| Método | Ruta                              | Descripción                          |
| ------ | --------------------------------- | ------------------------------------- |
| GET    | `/`                                | Health check básico                   |
| POST/GET/PUT/DELETE | `/api/users`, `/api/users/:id` | CRUD de usuarios                |
| POST   | `/api/users/:id/documents`        | Subir documento de un usuario         |
| POST/GET/PUT/DELETE | `/api/products`, `/api/products/:id` | CRUD de productos          |
| POST/GET/PUT/DELETE | `/api/couriers`, `/api/couriers/:id` | CRUD de repartidores       |
| POST/GET/PATCH/DELETE | `/api/orders`, `/api/orders/:id`, `/api/orders/:id/status` | CRUD de pedidos + cambio de estado |
| POST   | `/api/orders/:id/receipt`         | Subir comprobante de un pedido        |
| POST/GET/PATCH/DELETE | `/api/deliveries`, `/api/deliveries/:id`, `/api/deliveries/:id/status` | CRUD de entregas + cambio de estado |
| POST   | `/api/deliveries/:id/receipt`     | Subir comprobante de una entrega      |
| GET/POST | `/api/mocks/*`                  | Datos simulados y carga de prueba (ver sección de Mocking) |
| GET    | `/api/logs/test`                  | Prueba interna del logger             |
| GET    | `/api/docs`                       | Documentación Swagger                 |

## Historial de refactor (por módulo)

1. **Configuración y constantes**: variables de entorno centralizadas (`env.config.js`), constantes de dominio congeladas.
2. **Arquitectura por capas**: `users` y `products` refactorizados a Router → Controller → Service → Repository.
3. **Mocking**: generación y carga de datos de prueba (ver detalle abajo).
4. **Manejo de errores**: `CustomError` centralizado + middleware global (ver detalle abajo).
5. **Logging**: Winston con niveles, rotación de archivos y endpoint de prueba (ver detalle abajo).
6. **Documentación**: Swagger/OpenAPI interactivo (ver detalle abajo).
7. **Testing**: suite funcional con Mocha, Chai y Supertest (ver detalle abajo).
8. **Carga de archivos**: documentos y comprobantes con Multer (ver detalle abajo).

---


## Mocking y carga de datos de prueba

Se armó un módulo de mocking bajo `/api/mocks` para generar datos de prueba de las 4 entidades principales (usuarios, repartidores, pedidos y entregas), sin tener que cargarlos a mano.

Hay dos tipos de endpoints:

### 1. Ver datos simulados (no se guardan en la base)

Devuelven datos falsos generados al vuelo, solo para ver el formato o probar el frontend. No modifican la base de datos.

- `GET /api/mocks/users?qty=5` → usuarios simulados (con roles válidos: user, admin, courier)
- `GET /api/mocks/couriers?qty=5` → repartidores simulados
- `GET /api/mocks/orders?qty=5` → pedidos simulados (con estados y prioridades válidos)
- `GET /api/mocks/deliveries?qty=5` → entregas simuladas

El parámetro `qty` es opcional (por defecto genera 10, máximo 100).

### 2. Cargar datos de prueba reales en MongoDB

Insertan los datos generados directamente en la base de datos, respetando las relaciones entre entidades (un pedido se asocia a un usuario real, una entrega a un pedido y repartidor reales).

- `POST /api/mocks/users/seed?qty=5`
- `POST /api/mocks/couriers/seed?qty=5`
- `POST /api/mocks/orders/seed?qty=5`
- `POST /api/mocks/deliveries/seed?qty=5`

Cada uno responde con la cantidad insertada, por ejemplo:
```json
{ "insertados": 5, "coleccion": "usuarios" }
```

**Nota:** si intentás cargar `orders` o `deliveries` sin que existan usuarios, repartidores o pedidos previos, el sistema los genera automáticamente antes, para que las relaciones siempre sean válidas.


## Manejo de errores

Todos los errores de la API responden con una estructura uniforme desde un middleware centralizado (`src/middlewares/error.middleware.js`):

```json
{
  "status": "error",
  "message": "Descripción legible del error",
  "cause": "Detalle técnico de qué lo provocó"
}
```

Cada entidad tiene su propio diccionario de errores personalizados en `src/error/CustomError.js` (`UserError`, `ProductError`, `CourierError`, `OrderError`, `DeliveryError`, `MockError`), con su `statusCode` correspondiente (400 para datos inválidos, 404 para no encontrado, 409 para duplicados, etc.). Los errores se detectan en la capa de `service`, y viajan con `next(error)` hasta el middleware — ninguna ruta ni controller responde errores por su cuenta.

### Cómo probar casos inválidos

- `POST /api/couriers` sin `name` o `zone` → `400 EmptyCourierError`
- `POST /api/orders` sin datos, o con `weight` no numérico → `400 EmptyOrderError` / `InvalidWeightError`
- `POST /api/deliveries` sin `orderId` o `courierId` → `400 EmptyDeliveryError`
- `GET /api/orders/:id` con un id que no es un ObjectId válido → `400 ObjectIdParseError`
- `GET /api/mocks/users?qty=-5` o `?qty=abc` → `400 InvalidQtyError` (cantidad inválida o negativa)
- Si falla la inserción en MongoDB al usar `/api/mocks/*/seed`, responde `500 MockInsertError` con el detalle del fallo


## Logging (Winston)

El proyecto usa **Winston** como logger centralizado (`src/config/logger.js`), reemplazando los `console.log` sueltos.

### Niveles disponibles (de menos a más severo)

`debug` → `http` → `info` → `warning` → `error` → `fatal`

- **debug**: detalle interno de bajo nivel (ej: resultado de un servicio simulado)
- **http**: nivel reservado para tráfico HTTP
- **info**: eventos normales del negocio (servidor iniciado, conexión a Mongo, usuario/producto creado, notificación enviada, datos de prueba insertados)
- **warning**: errores esperados/de negocio (ej: usuario no encontrado, cantidad inválida en mocks, ruta inexistente)
- **error**: errores inesperados del servidor
- **fatal**: fallas críticas de arranque o conexión a la base

### Comportamiento según el entorno

- **Desarrollo** (`NODE_ENV=development`): se muestran todos los niveles, incluido `debug`.
- **Producción** (`NODE_ENV=production`): solo se registran desde `info` para arriba (se omiten `debug` y `http`).

### Cómo probar el endpoint de logs

Dispara un log de cada uno de los 6 niveles. No representa una funcionalidad real del negocio, es solo para verificar la configuración. Revisá la consola y la carpeta `/logs` después de llamarlo.

### Dónde se guardan los logs

En la carpeta `/logs`, con rotación diaria por fecha:
- `info-YYYY-MM-DD.log`: todo desde `info` para arriba
- `error-YYYY-MM-DD.log`: **solo** `error` y `fatal`

Estos archivos se generan automáticamente y **no se suben al repositorio** (están en `.gitignore`), ya que son datos generados en tiempo de ejecución, no código fuente.
## Documentación de la API (Swagger)

La API está documentada con **Swagger/OpenAPI 3.0**, usando `swagger-jsdoc` (lee comentarios `@swagger` de cada ruta) y `swagger-ui-express` (sirve la interfaz interactiva).

### Cómo acceder

Con el servidor corriendo (`npm run dev`), entrá a: http://localhost:8080/api/docs


Desde ahí podés ver y **probar en vivo** cada endpoint (botón "Try it out"), sin necesidad de Postman.

### Qué está documentado

La documentación está organizada en 5 grupos (tags):

- **Users**: CRUD completo de usuarios
- **Orders**: CRUD de pedidos + actualización de estado
- **Deliveries**: CRUD de entregas + actualización de estado
- **Mocks**: generación de datos simulados (`GET`, sin guardar) y carga de datos de prueba reales (`POST /seed`)
- **Logger**: endpoint interno de validación del sistema de logs (`GET /api/logs/test`) — **no es una funcionalidad de negocio**, solo sirve para confirmar que Winston está bien configurado

Cada endpoint documenta: método HTTP, ruta, descripción, parámetros (path/query), body esperado, respuesta exitosa y posibles errores — reflejando el comportamiento real de la API (los mismos `CustomError` definidos en `src/error/CustomError.js`).

### Nota sobre autenticación

El proyecto no implementa autenticación (no hay login ni rutas protegidas), por lo que no se documentan errores 401/403 — no existen en el comportamiento real de la API.

### Schemas reutilizables

`User`, `Order`, `OrderItem`, `Delivery`, `ErrorResponse`, `SuccessResponse`, `SeedResponse` — definidos en `src/config/swagger.js`, separados de la lógica de las rutas.

## Testing (Mocha + Chai + Supertest)

El proyecto cuenta con una suite de tests funcionales que valida los endpoints principales de la API.

### Entorno de testing

Los tests corren contra una **base de datos separada** de la de desarrollo (`ShipNowTest` en vez de la real), usando variables de entorno propias en `.env.test` (no se sube al repositorio; hay un `.env.test.example` como plantilla). Al correr los tests, `NODE_ENV=test` hace que la app cargue automáticamente `.env.test` en vez de `.env`.

### Cómo ejecutar los tests

```bash
npm test
```

Esto corre Mocha con la configuración de `.mocharc.json`, que:
1. Fuerza `NODE_ENV=test` (`test/setup.js`)
2. Conecta a la base de testing antes de empezar, y la desconecta al final (`test/hooks/db.js`)
3. Ejecuta todos los archivos en `test/functional/**/*.test.js`

### Qué está cubierto

- **Users**: listado, creación (casos exitoso, datos incompletos, rol inválido)
- **Orders**: creación, consulta por id, actualización de estado (casos exitosos y de error: datos incompletos, peso inválido, id inválido, recurso inexistente)
- **Mocks**: generación simulada (`GET`, sin persistir) y carga real (`POST /seed`), incluyendo cantidades inválidas
- **Logger**: endpoint de prueba de los 6 niveles
- **Swagger**: que la documentación interactiva responda correctamente
- **Ruta inexistente**: formato de error 404 uniforme

### Limpieza de datos

Cada grupo de tests limpia las colecciones relevantes de la base de testing antes y/o después de correr (`test/helpers/cleanup.js`), para que los tests sean repetibles y no dependan de datos previos.

## Carga de archivos (Multer)

El proyecto permite subir documentos y comprobantes usando **Multer**, con la configuración centralizada en `src/config/upload.js` (separada de las rutas).

### Restricciones

- Tipos de archivo permitidos: **PDF, JPG, PNG**
- Tamaño máximo: **5MB**
- En la base de datos solo se guardan **metadatos** (nombre original, nombre generado, ruta, tipo, tamaño, fecha) — nunca el archivo binario en sí. Los archivos reales quedan en la carpeta `uploads/` (excluida del repositorio vía `.gitignore`).

### Endpoints

**Documento de usuario** (ej: DNI, licencia):

POST /api/users/:id/documents
Content-Type: multipart/form-data

document: <archivo> (requerido)
documentType: dni | license | other (opcional)


**Comprobante de un pedido:**

POST /api/orders/:id/receipt
Content-Type: multipart/form-data

receipt: <archivo> (requerido)


**Comprobante de una entrega:**

POST /api/deliveries/:id/receipt
Content-Type: multipart/form-data

receipt: <archivo> (requerido)


### Errores posibles

Todos responden con el formato de error estándar del proyecto (`status`, `message`, `cause`):

- `400`: no se envió archivo, tipo no permitido, tamaño excedido, o `documentType` inválido
- `404`: la entidad (usuario/pedido/entrega) no existe
- `500`: falló el guardado del archivo o sus metadatos

### Documentación y tests

Los 3 endpoints están documentados en Swagger (`/api/docs`) como `multipart/form-data`, y cubiertos por tests funcionales en `test/functional/uploads.test.js` (carga exitosa, archivo faltante, tipo inválido, `documentType` inválido, entidad inexistente).