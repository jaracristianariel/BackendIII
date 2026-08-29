import swaggerJsdoc from "swagger-jsdoc";
import config from "./env.config.js";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'ShipNow API',
        version: '1.0.0',
        description:
            'API de logística/envíos ShipNow: gestión de usuarios, pedidos, repartidores y entregas, ' +
            'con arquitectura por capas, manejo centralizado de errores, generación de datos de prueba (mocks) ' +
            'y logging profesional.',
    },
    servers: [
        {
            url: `http://localhost:${config.PORT}`,
            description: 'Servidor local',
        },
    ],
    tags: [
        { name: 'Users', description: 'Gestión de usuarios (clientes)' },
        { name: 'Orders', description: 'Gestión de pedidos/envíos' },
        { name: 'Deliveries', description: 'Gestión de entregas (vincula un pedido con un repartidor)' },
        { name: 'Mocks', description: 'Generación y carga de datos de prueba' },
        { name: 'Logger', description: 'Endpoint interno de validación del sistema de logs (no es funcionalidad de negocio)' },
    ],
    components: {
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error' },
                    message: { type: 'string', example: 'Descripción legible del error' },
                    cause: { type: 'string', example: 'Detalle técnico de qué lo provocó' },
                },
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
                    first_name: { type: 'string', example: 'Ana' },
                    last_name: { type: 'string', example: 'Pérez' },
                    email: { type: 'string', example: 'ana.perez@test.com' },
                    role: { type: 'string', enum: ['user', 'admin', 'courier'], example: 'user' },
                },
            },
            OrderItem: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Zapatillas running' },
                    quantity: { type: 'number', example: 2 },
                    price: { type: 'number', example: 25000 },
                },
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
                    customerName: { type: 'string', example: 'Ana Pérez' },
                    customer: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0aa', description: 'ObjectId del User asociado' },
                    address: { type: 'string', example: 'Av. Siempre Viva 742' },
                    weight: { type: 'number', example: 5 },
                    cost: { type: 'number', example: 50 },
                    status: { type: 'string', enum: ['pending', 'in_transit', 'delivered'], example: 'pending' },
                    priority: { type: 'string', enum: ['normal', 'high'], example: 'normal' },
                    items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/OrderItem' },
                    },
                    courierId: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0bb', description: 'ObjectId del Courier asociado' },
                },
            },
            Delivery: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d2' },
                    orderId: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
                    courierId: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0bb' },
                    status: { type: 'string', enum: ['assigned', 'in_transit', 'delivered'], example: 'assigned' },
                    assignedAt: { type: 'string', format: 'date-time' },
                },
            },
            SuccessResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Operación realizada con éxito' },
                },
            },
            SeedResponse: {
                type: 'object',
                properties: {
                    insertados: { type: 'number', example: 5 },
                    coleccion: { type: 'string', example: 'usuarios' },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    // Swagger lee los comentarios @swagger de todos los archivos de rutas.
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;