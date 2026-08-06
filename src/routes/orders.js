import express from "express";
const router = express.Router();

import OrderController from "../controller/order.controller.js";

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.patch('/:id/status', OrderController.updateStatus);
router.delete('/:id', OrderController.delete);

export default router;