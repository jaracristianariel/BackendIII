import express from 'express';
const router = express.Router();

import MocksController from '../controller/mocks.controller.js';

/**
 * @swagger
 * components:
 *   parameters:
 *     qtyParam:
 *       in: query
 *       name: qty
 *       required: false
 *       schema: { type: integer, default: 10, minimum: 1, maximum: 100 }
 *       description: Cantidad de registros a generar (por defecto 10, máximo 100)
 */

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera usuarios simulados, sin guardarlos en la base
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       200:
 *         description: Usuarios simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: La cantidad (qty) no es válida (negativa, no numérica o mayor al máximo)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', MocksController.getUsers);

/**
 * @swagger
 * /api/mocks/couriers:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera repartidores simulados, sin guardarlos en la base
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       200:
 *         description: Repartidores simulados
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/couriers', MocksController.getCouriers);

/**
 * @swagger
 * /api/mocks/orders:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera pedidos simulados, sin guardarlos en la base
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       200:
 *         description: Pedidos simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/orders', MocksController.getOrders);

/**
 * @swagger
 * /api/mocks/deliveries:
 *   get:
 *     tags: [Mocks]
 *     summary: Genera entregas simuladas, sin guardarlas en la base
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       200:
 *         description: Entregas simuladas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/deliveries', MocksController.getDeliveries);

/**
 * @swagger
 * /api/mocks/users/seed:
 *   post:
 *     tags: [Mocks]
 *     summary: Genera e inserta usuarios de prueba reales en MongoDB
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       201:
 *         description: Usuarios insertados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Falló la inserción en MongoDB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/users/seed', MocksController.seedUsers);

/**
 * @swagger
 * /api/mocks/couriers/seed:
 *   post:
 *     tags: [Mocks]
 *     summary: Genera e inserta repartidores de prueba reales en MongoDB
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       201:
 *         description: Repartidores insertados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Falló la inserción en MongoDB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/couriers/seed', MocksController.seedCouriers);

/**
 * @swagger
 * /api/mocks/orders/seed:
 *   post:
 *     tags: [Mocks]
 *     summary: Genera e inserta pedidos de prueba reales en MongoDB (si no hay usuarios, los genera antes)
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       201:
 *         description: Pedidos insertados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Falló la inserción en MongoDB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/orders/seed', MocksController.seedOrders);

/**
 * @swagger
 * /api/mocks/deliveries/seed:
 *   post:
 *     tags: [Mocks]
 *     summary: Genera e inserta entregas de prueba reales en MongoDB (si no hay pedidos o repartidores, los genera antes)
 *     parameters:
 *       - $ref: '#/components/parameters/qtyParam'
 *     responses:
 *       201:
 *         description: Entregas insertadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedResponse'
 *       400:
 *         description: La cantidad (qty) no es válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Falló la inserción en MongoDB
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/deliveries/seed', MocksController.seedDeliveries);

export default router;