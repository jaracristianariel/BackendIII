import express from 'express';
import logger from './config/logger.js';
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

// Montamos los routers.
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/couriers', couriersRouter);
app.use('/api/products', productsRouter);
app.use('/api/deliveries', deliveriesRouter);

app.use('/api/mocks', mocksRouter);
app.use('/api/logs', logsRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de health check basica.
app.get('/', (req, res) => {
    res.send('ShipNow API v1 - corriendo');
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