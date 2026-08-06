import { generateUser, generateCourier, generateOrder, generateDelivery } from "../../test/mocks/generators.js";
import UserRepository from "../repositories/users.repository.js";
import CourierRepository from "../repositories/couriers.repository.js";
import OrderRepository from "../repositories/orders.repository.js";
import DeliveryRepository from "../repositories/deliveries.repository.js";
import { CustomError, MockError } from "../error/CustomError.js";

const MAX_QTY = 100;

// Valida que qty sea un entero positivo, dentro del máximo permitido.
// Si no lo es, corta la ejecución con un error controlado (no lo "arregla" en silencio).
function assertValidQty(qty) {
    if (!Number.isInteger(qty) || qty <= 0 || qty > MAX_QTY) {
        throw new CustomError(MockError.InvalidQtyError);
    }
}

class MocksService {
    // ---- Simulados: NO se guardan en la base ----
    static getUsers(qty) {
        assertValidQty(qty);
        return Array.from({ length: qty }, () => generateUser());
    }

    static getCouriers(qty) {
        assertValidQty(qty);
        return Array.from({ length: qty }, () => generateCourier());
    }

    static getOrders(qty) {
        assertValidQty(qty);
        return Array.from({ length: qty }, () => generateOrder());
    }

    static getDeliveries(qty) {
        assertValidQty(qty);
        return Array.from({ length: qty }, () => generateDelivery());
    }

    // ---- Seed: se insertan de verdad en Mongo, con relaciones reales ----
    static async seedUsers(qty) {
        assertValidQty(qty);
        try {
            const users = Array.from({ length: qty }, () => generateUser());
            return await UserRepository.insertMany(users);
        } catch (error) {
            throw new CustomError({ ...MockError.MockInsertError, cause: error.message });
        }
    }

    static async seedCouriers(qty) {
        assertValidQty(qty);
        try {
            const couriers = Array.from({ length: qty }, () => generateCourier());
            return await CourierRepository.insertMany(couriers);
        } catch (error) {
            throw new CustomError({ ...MockError.MockInsertError, cause: error.message });
        }
    }

    static async seedOrders(qty) {
        assertValidQty(qty);
        try {
            let users = await UserRepository.find();
            if (users.length === 0) {
                users = await this.seedUsers(5);
            }

            const orders = Array.from({ length: qty }, () => {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                return generateOrder(randomUser._id);
            });

            return await OrderRepository.insertMany(orders);
        } catch (error) {
            if (error instanceof CustomError) throw error; // ya viene bien formado (ej: InvalidQtyError de seedUsers)
            throw new CustomError({ ...MockError.MockInsertError, cause: error.message });
        }
    }

    static async seedDeliveries(qty) {
        assertValidQty(qty);
        try {
            let orders = await OrderRepository.find();
            if (orders.length === 0) {
                orders = await this.seedOrders(5);
            }

            let couriers = await CourierRepository.find();
            if (couriers.length === 0) {
                couriers = await this.seedCouriers(5);
            }

            const deliveries = Array.from({ length: qty }, () => {
                const randomOrder = orders[Math.floor(Math.random() * orders.length)];
                const randomCourier = couriers[Math.floor(Math.random() * couriers.length)];
                return generateDelivery(randomOrder._id, randomCourier._id);
            });

            return await DeliveryRepository.insertMany(deliveries);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError({ ...MockError.MockInsertError, cause: error.message });
        }
    }
}

export default MocksService;