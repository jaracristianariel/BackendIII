import express from "express";
const router = express.Router();

import ProductController from "../controller/product.controller.js";

// POST /api/products -> crea un producto
router.post('/', ProductController.create);

// GET /api/products -> lista de productos
router.get('/', ProductController.getAll);

// GET /api/products/:id -> muestra un producto por id
router.get('/:id', ProductController.getById);

// PUT /api/products/:id -> cambia datos de un producto por id
router.put('/:id', ProductController.update);

// DELETE /api/products/:id -> elimina un producto por id
router.delete('/:id', ProductController.delete);

export default router;