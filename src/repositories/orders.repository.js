import Order from "../models/order.js";

class OrderRepository {
    static async create(data) {
        return await Order.create(data);
    }

    static async find() {
        return await Order.find();
    }

    static async findById(id) {
        return await Order.findById(id);
    }

    static async updateStatus(id, status) {
        return await Order.findByIdAndUpdate(id, { status }, { new: true });
    }

    static async deleteById(id) {
        return await Order.findByIdAndDelete(id);
    }

    static async insertMany(orders) {
        return await Order.insertMany(orders);
    }
    static async setReceipt(id, receiptMeta) {
        return await Order.findByIdAndUpdate(
            id,
            { receipt: receiptMeta },
            { new: true, runValidators: true }
        );
    }
}

export default OrderRepository;