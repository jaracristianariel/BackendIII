import Order from "../models/order.js";

class OrderRepository {
    static async create(data) {
        return await Order.create(data);
    }

    static async find() {
        return await Order.find();
    }

    static async findPaginated(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Order.find().skip(skip).limit(limit),
            Order.countDocuments(),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
    }

    static async findById(id) {
        return await Order.findById(id);
    }

    static async updateStatus(id, status) {
        return await Order.findByIdAndUpdate(id, { status }, { new: true });
    }

    static async setReceipt(id, receiptMeta) {
        return await Order.findByIdAndUpdate(id, { receipt: receiptMeta }, { new: true, runValidators: true });
    }

    static async deleteById(id) {
        return await Order.findByIdAndDelete(id);
    }

    static async insertMany(orders) {
        return await Order.insertMany(orders);
    }
}

export default OrderRepository;