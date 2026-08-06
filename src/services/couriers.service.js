import CourierRepository from "../repositories/couriers.repository.js";
import { CustomError, CourierError } from "../error/CustomError.js";

class CourierService {
    static async create(name, zone, available) {
        if (!name || !zone) {
            throw new CustomError(CourierError.EmptyCourierError);
        }
        return await CourierRepository.create({
            name,
            zone,
            available: available !== undefined ? available : true,
        });
    }

    static async getAll() {
        return await CourierRepository.find();
    }

    static async getById(id) {
        return await CourierRepository.findById(id);
    }

    static async update(id, name, zone, available) {
        const data = {};
        if (name !== undefined) data.name = name;
        if (zone !== undefined) data.zone = zone;
        if (available !== undefined) data.available = available;

        return await CourierRepository.updateById(id, data);
    }

    static async delete(id) {
        return await CourierRepository.deleteById(id);
    }
}

export default CourierService;