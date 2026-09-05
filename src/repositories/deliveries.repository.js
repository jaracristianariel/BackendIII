import Delivery from "../models/delivery.js";

class DeliveryRepository {
    static async create(data) {
        return await Delivery.create(data);
    }

    static async find() {
        return await Delivery.find();
    }

    static async findPaginated(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Delivery.find().skip(skip).limit(limit),
            Delivery.countDocuments(),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
    }

    static async findById(id) {
        return await Delivery.findById(id);
    }

    static async updateStatus(id, status) {
        return await Delivery.findByIdAndUpdate(id, { status }, { new: true });
    }

    static async setReceipt(id, receiptMeta) {
        return await Delivery.findByIdAndUpdate(id, { receipt: receiptMeta }, { new: true, runValidators: true });
    }

    static async deleteById(id) {
        return await Delivery.findByIdAndDelete(id);
    }

    static async insertMany(deliveries) {
        return await Delivery.insertMany(deliveries);
    }
}

export default DeliveryRepository;