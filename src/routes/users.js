import express from "express";
const router = express.Router();

import UserController from "../controller/user.controller.js";

// POST /api/users -> crea un cliente
router.post('/', UserController.create);

// GET /api/users -> lista clientes
router.get('/', UserController.getAll);

// GET /api/users/:id -> obtiene un cliente por id
router.get('/:id', UserController.getById);

export default router;