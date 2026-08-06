import Courier from "../models/courier.js";

class CourierRepository {
    static async create(data) {
        return await Courier.create(data);
    }

    static async find() {
        return await Courier.find();
    }

    static async findById(id) {
        return await Courier.findById(id);
    }

    static async updateById(id, data) {
        return await Courier.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteById(id) {
        return await Courier.findByIdAndDelete(id);
    }

    static async insertMany(couriers) {
        return await Courier.insertMany(couriers);
    }
}

export default CourierRepository;