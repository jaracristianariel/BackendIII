# ShipNow

API de demostracion de una plataforma de **logistica / envios**, construida con
**Node.js + Express + MongoDB (Mongoose)**.

Este proyecto es **material didactico** del curso **Backend 3 de CoderHouse**.
Es la **version 1 (baseline)**: una API funcional pero escrita a proposito con
malas practicas, para que a lo largo del curso la refactoricemos hacia una
arquitectura profesional.

> ⚠️ **No copies este codigo como ejemplo de buenas practicas.** Es el punto de
> partida "sucio" sobre el que vamos a trabajar.

## Que hace ShipNow

Gestiona cinco entidades:

- **Order** (envio/pedido): `customerName`, `customer` (ref a User), `address`, `weight`, `cost` (calculado), `status`, `priority`, `items` (array de `{ name, quantity, price }`), `courierId`.
- **User** (cliente): `name`, `email`, `role` (admin / customer / driver).
- **Courier** (repartidor): `name`, `zone`, `available`.
- **Product** (producto): `name`, `price`, `stock`, `status` (available / out_of_stock).
- **Delivery** (entrega): `orderId` (ref a Order), `courierId` (ref a Courier), `status` (assigned / in_transit / delivered), `assignedAt`.

Regla de negocio principal (hoy embebida en la ruta de orders):
`cost = weight * 10`. Al crear un envio tambien se dispara una notificacion falsa.
Al consultar una entrega por id (`GET /api/deliveries/:id`) se llama inline a un
"proveedor externo" de tracking falso (`src/services/trackingProvider.js`).

## Como correrlo

Requisitos: Node.js y una instancia de MongoDB corriendo en `localhost:27017`.

Para levantar MongoDB rapido con Docker:

```bash
docker run -d -p 27017:27017 --name shipnow-mongo mongo
```

Tambien sirve una instalacion local de MongoDB o un cluster de MongoDB Atlas
(en ese caso ajusta la URI hardcodeada en `src/db.js` y `src/seed.js`).

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Cargar datos de ejemplo relacionados
npm run seed

# 3. Levantar el servidor
npm start
# o
npm run dev
```

El servidor queda escuchando en `http://localhost:8080`.

### Endpoints

| Metodo | Ruta                       | Descripcion                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | `/`                        | Health check basico               |
| POST   | `/api/users`               | Crear cliente                     |
| GET    | `/api/users`               | Listar clientes                   |
| GET    | `/api/users/:id`           | Obtener cliente por id            |
| POST   | `/api/products`            | Crear producto                    |
| GET    | `/api/products`            | Listar productos                  |
| GET    | `/api/products/:id`        | Obtener producto por id           |
| POST   | `/api/couriers`            | Crear repartidor                  |
| GET    | `/api/couriers`            | Listar repartidores               |
| GET    | `/api/couriers/:id`        | Obtener repartidor por id         |
| POST   | `/api/orders`              | Crear envio                       |
| GET    | `/api/orders`              | Listar envios                     |
| GET    | `/api/orders/:id`          | Obtener envio por id              |
| PATCH  | `/api/orders/:id/status`   | Cambiar estado de un envio        |
| POST   | `/api/deliveries`          | Crear entrega (order + courier)   |
| GET    | `/api/deliveries`          | Listar entregas                   |
| GET    | `/api/deliveries/:id`      | Obtener entrega + tracking        |
| PATCH  | `/api/deliveries/:id/status` | Cambiar estado de una entrega   |

Ejemplo de creacion de envio:

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Ana Lopez","address":"Calle Falsa 123","weight":5}'
```

## Probar con Postman

En la carpeta `postman/` hay una coleccion lista para importar:
`postman/ShipNow.postman_collection.json`.

1. Abre Postman -> **Import** -> selecciona el archivo.
2. La coleccion trae una variable `{{baseUrl}}` que por defecto apunta a
   `http://localhost:8080`. Si cambias el puerto, edita esa variable.
3. Hay una carpeta por entidad (Users, Products, Couriers, Orders, Deliveries)
   con un request por endpoint. Los POST/PATCH incluyen un body JSON de ejemplo.
4. Para los requests que usan `:id` (o refs como `customer`, `orderId`,
   `courierId`), copia los ids reales de la respuesta de un GET/POST previo.

## Deuda tecnica conocida

Esta seccion es **intencional y honesta**: lista los problemas que el codigo tiene
hoy a proposito, y que iremos resolviendo modulo a modulo durante el curso.

1. **Configuracion hardcodeada.** La URI de Mongo (`src/db.js`), el `PORT` y un
   `SECRET` falso (`src/index.js`) estan escritos directamente en el codigo, en
   lugar de leerse desde variables de entorno (`.env` + `dotenv`) y una capa de
   configuracion. *(Se corrige en el Modulo 1.)*

2. **Controllers gordos (fat controllers) / logica en las rutas.** Cada handler
   mezcla en un solo bloque la validacion manual, la logica de negocio, el acceso
   directo a la base y los efectos secundarios. No hay capa de **services** ni de
   **repositories**. El ejemplo mas claro es `src/routes/orders.js`.

3. **Acoplamiento del efecto secundario.** La notificacion
   (`src/services/notifications.js`) se importa y se llama inline dentro de la ruta
   de orders, acoplando la logica de negocio con el envio de notificaciones.

4. **Manejo de errores crudo.** Todos los `try/catch` responden con un generico
   `res.status(500).send("Error del servidor")`. No hay una capa de errores ni
   errores de dominio personalizados.

5. **Logging pobre.** Solo se usa `console.log`. No hay un logger real con niveles,
   formato ni transporte.

6. **Validacion manual repetida.** Cada ruta (`products`, `deliveries`, `orders`,
   etc.) repite chequeos `if (!campo)` a mano. No hay esquemas de validacion ni
   middleware reutilizable.

7. **Integracion externa acoplada.** El "proveedor de tracking"
   (`src/services/trackingProvider.js`) se llama inline desde la ruta de
   deliveries, sin abstraccion ni inyeccion. Sirve como ejemplo de algo que
   habra que mockear en los tests.

8. **Verificacion de relaciones en la ruta.** Al crear una delivery se hace
   `Order.findById` / `Courier.findById` directo en el handler para validar que
   existan, acoplando aun mas la ruta a la base.

9. **Sin tests, sin Swagger, sin upload de archivos, sin Docker.** Estas piezas se
   agregan en modulos posteriores; su ausencia aca es intencional. El script de
   seed (`src/seed.js`) y la coleccion de Postman son tooling de apoyo, no
   features de la API.

## Roadmap del curso (que vamos a refactorizar)

- **Modulo 1:** variables de entorno + capa de configuracion (matar el hardcode).
- **Modulos siguientes:** capa de services y repositories, manejo de errores,
  logger profesional, tests, documentacion con Swagger, uploads y Docker.
# BackendIII


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