import express from "express";
const router = express.Router();

import DeliveryController from "../controller/delivery.controller.js";

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     tags: [Deliveries]
 *     summary: Crea una entrega, asociando un pedido con un repartidor existentes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, courierId]
 *             properties:
 *               orderId: { type: string, example: 66f1a2b3c4d5e6f7a8b9c0d1 }
 *               courierId: { type: string, example: 66f1a2b3c4d5e6f7a8b9c0bb }
 *               status: { type: string, enum: [assigned, in_transit, delivered], example: assigned }
 *     responses:
 *       201:
 *         description: Entrega creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Faltan datos obligatorios (orderId o courierId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: El pedido o el repartidor indicados no existen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', DeliveryController.create);

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     tags: [Deliveries]
 *     summary: Lista todas las entregas
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 */
router.get('/', DeliveryController.getAll);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     tags: [Deliveries]
 *     summary: Obtiene una entrega por id, incluyendo su estado de tracking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ObjectId de Mongo de la entrega
 *     responses:
 *       200:
 *         description: Entrega encontrada, con su tracking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery:
 *                   $ref: '#/components/schemas/Delivery'
 *                 tracking:
 *                   type: object
 *                   properties:
 *                     status: { type: string, example: in_transit }
 *       400:
 *         description: El id no tiene formato de ObjectId válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrega no existente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', DeliveryController.getById);

/**
 * @swagger
 * /api/deliveries/{id}/status:
 *   patch:
 *     tags: [Deliveries]
 *     summary: Actualiza el estado de una entrega
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ObjectId de Mongo de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [assigned, in_transit, delivered], example: delivered }
 *     responses:
 *       200:
 *         description: Entrega con el estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Falta el status, o el id no tiene formato de ObjectId válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrega no existente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/status', DeliveryController.updateStatus);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   delete:
 *     tags: [Deliveries]
 *     summary: Elimina una entrega
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ObjectId de Mongo de la entrega
 *     responses:
 *       200:
 *         description: Entrega eliminada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     delivery:
 *                       $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: El id no tiene formato de ObjectId válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrega no existente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', DeliveryController.delete);

export default router;