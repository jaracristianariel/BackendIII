import ProductService from '../services/products.service.js';
import { CustomError, ProductError } from '../error/CustomError.js';

class ProductController {
    static async create(req, res, next) {
        try {
            const { name, price, stock, status } = req.body;
            const product = await ProductService.create(name, price, stock, status);

            console.log('Product creado:', product._id);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const products = await ProductService.getAll();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const product = await ProductService.getById(req.params.id);
            if (!product) {
                return next(new CustomError(ProductError.ProductNotFoundError));
            }
            res.json(product);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(ProductError.ObjectIdParseError));
            }
            next(error);
        }
    }
}

export default ProductController;