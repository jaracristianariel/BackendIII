import express from "express";
const router = express.Router();

import DeliveryController from "../controller/delivery.controller.js";

router.post('/', DeliveryController.create);
router.get('/', DeliveryController.getAll);
router.get('/:id', DeliveryController.getById);
router.patch('/:id/status', DeliveryController.updateStatus);
router.delete('/:id', DeliveryController.delete);

export default router;