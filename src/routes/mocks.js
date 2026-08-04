import express from 'express';
const router = express.Router();

import MocksController from '../controller/mocks.controller.js';

router.get('/users', MocksController.getUsers);
router.get('/couriers', MocksController.getCouriers);
router.get('/orders', MocksController.getOrders);
router.get('/deliveries', MocksController.getDeliveries);

router.post('/users/seed', MocksController.seedUsers);
router.post('/couriers/seed', MocksController.seedCouriers);
router.post('/orders/seed', MocksController.seedOrders);
router.post('/deliveries/seed', MocksController.seedDeliveries);

export default router;