import Product from '../models/product.js';

class ProductRepository {
    static async create(data) {
        return await Product.create(data);
    }

    static async find() {
        return await Product.find();
    }

    static async findById(id) {
        return await Product.findById(id);
    }
}

export default ProductRepository;