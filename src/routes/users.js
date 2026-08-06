import express from "express";
const router = express.Router();

import UserController from "../controller/user.controller.js";

// POST /api/users -> crea un cliente
router.post('/', UserController.create);

// GET /api/users -> lista clientes
router.get('/', UserController.getAll);

// GET /api/users/:id -> obtiene un cliente por id
router.get('/:id', UserController.getById);

// PUT /api/users/:id -> cambia datos de un cliente por id
router.put('/:id', UserController.update);

// DELETE /api/users/:id -> borra un cliente por id
router.delete('/:id', UserController.delete);

export default router;