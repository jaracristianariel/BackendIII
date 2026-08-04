import Order from "../models/order.js";

class OrderRepository {
    static async find() {
        return await Order.find();
    }

    static async insertMany(orders) {
        return await Order.insertMany(orders);
    }
}

export default OrderRepository;