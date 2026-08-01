import ProductRepository from '../repositories/products.repository.js';
import { CustomError, ProductError } from '../error/CustomError.js';
import { PRODUCT_STATUS } from '../constants/index.js'; // el que vamos a crear

class ProductService {
    static async create(name, price, stock, status) {
        if (!name || price === undefined) {
            throw new CustomError(ProductError.EmptyProductError);
        }
        if (typeof price !== 'number' || price < 0) {
            throw new CustomError(ProductError.InvalidPriceError);
        }

        const product = await ProductRepository.create({
            name,
            price,
            stock: stock !== undefined ? stock : 0,
            status: status || PRODUCT_STATUS.AVAILABLE,
        });

        return product;
    }

    static async getAll() {
        return await ProductRepository.find();
        // Opcional (regla de negocio): filtrar sin stock antes de devolver
        // const products = await ProductRepository.find();
        // return products.filter(p => p.status !== PRODUCT_STATUS.OUT_OF_STOCK);
    }

    static async getById(id) {
        return await ProductRepository.findById(id);
    }
}

export default ProductService;