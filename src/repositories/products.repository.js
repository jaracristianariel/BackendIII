import Product from "../models/product.js";

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

    static async updateById(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteById(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default ProductRepository;