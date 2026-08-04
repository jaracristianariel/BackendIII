import Delivery from '../models/delivery.js';

class DeliveryRepository {
    static async find() {
        return await Delivery.find();
    }

    static async insertMany(deliveries) {
        return await Delivery.insertMany(deliveries);
    }
}

export default DeliveryRepository;