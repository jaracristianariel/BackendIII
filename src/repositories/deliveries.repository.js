import Delivery from "../models/delivery.js";

class DeliveryRepository {
    static async create(data) {
        return await Delivery.create(data);
    }

    static async find() {
        return await Delivery.find();
    }

    static async findById(id) {
        return await Delivery.findById(id);
    }

    static async updateStatus(id, status) {
        return await Delivery.findByIdAndUpdate(id, { status }, { new: true });
    }

    static async deleteById(id) {
        return await Delivery.findByIdAndDelete(id);
    }

    static async insertMany(deliveries) {
        return await Delivery.insertMany(deliveries);
    }
    static async setReceipt(id, receiptMeta) {
        return await Delivery.findByIdAndUpdate(
            id,
            { receipt: receiptMeta },
            { new: true, runValidators: true }
        );
    }
}

export default DeliveryRepository;