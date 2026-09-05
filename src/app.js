import express from 'express';
import logger from './config/logger.js';
import config from './config/env.config.js';
import { errorHandler } from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import mocksRouter from './routes/mocks.js';
import logsRouter from './routes/logs.js';
import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';
import couriersRouter from './routes/couriers.js';
import productsRouter from './routes/products.js';
import deliveriesRouter from './routes/deliveries.js';

const app = express();

// Middleware para parsear JSON.
app.use(express.json());

// Montamos los routers de negocio (siempre disponibles, en cualquier entorno).
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/couriers', couriersRouter);
app.use('/api/products', productsRouter);
app.use('/api/deliveries', deliveriesRouter);

// Endpoints internos (herramientas de desarrollo, no funcionalidad de negocio).
// Criterio: se bloquean en produccion, ya que no deben quedar expuestos
// a usuarios finales ni permitir generar datos de prueba en una base real.
if (config.NODE_ENV !== 'production') {
    app.use('/api/mocks', mocksRouter);
    app.use('/api/logs', logsRouter);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
    app.use(['/api/mocks', '/api/logs', '/api/docs'], (req, res) => {
        res.status(404).json({
            status: 'error',
            message: 'Ruta no encontrada',
            cause: 'Este endpoint no esta disponible en produccion',
        });
    });
}

// Health check: estado basico de la API, sin exponer informacion sensible
// (nada de URIs, secretos, ni detalles internos).
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: config.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.get('/', (req, res) => {
    res.send('ShipNow API - corriendo');
});

// Ruta inexistente: no matcheo con ningun router de arriba.
app.use((req, res, next) => {
    logger.warning(`Ruta inexistente: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada',
        cause: `No existe ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler);

export default app;