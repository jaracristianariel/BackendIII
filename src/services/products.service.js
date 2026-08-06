import ProductRepository from "../repositories/products.repository.js";
import { CustomError, ProductError } from "../error/CustomError.js";
import { PRODUCT_STATUS } from "../constants/index.js";

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
    }

    static async getById(id) {
        return await ProductRepository.findById(id);
    }

    static async update(id, name, price, stock, status) {
        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
            throw new CustomError(ProductError.InvalidPriceError);
        }

        const data = {};
        if (name !== undefined) data.name = name;
        if (price !== undefined) data.price = price;
        if (stock !== undefined) data.stock = stock;
        if (status !== undefined) data.status = status;

        return await ProductRepository.updateById(id, data);
    }

    static async delete(id) {
        return await ProductRepository.deleteById(id);
    }
}

export default ProductService;