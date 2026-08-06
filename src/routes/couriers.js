import express from "express";
const router = express.Router();

import CourierController from "../controller/courier.controller.js";

router.post('/', CourierController.create);
router.get('/', CourierController.getAll);
router.get('/:id', CourierController.getById);
router.put('/:id', CourierController.update);
router.delete('/:id', CourierController.delete);

export default router;