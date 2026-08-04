import Courier from "../models/courier.js";

class CourierRepository {
    static async find() {
        return await Courier.find();
    }

    static async insertMany(couriers) {
        return await Courier.insertMany(couriers);
    }
}

export default CourierRepository;