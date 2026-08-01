import express from 'express';
const router = express.Router();

import ProductController from '../controller/product.controller.js';

router.post('/', ProductController.create);
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

export default router;