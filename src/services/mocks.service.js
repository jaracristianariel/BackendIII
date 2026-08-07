import { generateUser, generateCourier, generateOrder, generateDelivery } from "../../test/mocks/generators.js";
import UserRepository from "../repositories/users.repository.js";
import CourierRepository from "../repositories/couriers.repository.js";
import OrderRepository from "../repositories/orders.repository.js";
import DeliveryRepository from "../repositories/deliveries.repository.js";
import { CustomError, MockError } from "../error/CustomError.js";
import logger from "../config/logger.js";

const MAX_QTY = 100;

function assertValidQty(qty) {
    if (!Number.isInteger(qty) || qty <= 0 || qty > MAX_QTY) {
        throw new CustomError(MockError.InvalidQtyError);
    }
}

class MocksService {
    // ---- Simulados: NO se guardan en la base ----
    static getUsers(qty) {
        assertValidQty(qty);
        logger.debug(`Generando ${qty} usuarios simulados (sin guardar)`);
        return Array.from({ length: qty }, () => generateUser());
    }

    static getCouriers(qty) {
        assertValidQty(qty);
        logger.debug(`Generando ${qty} couriers simulados (sin guardar)`);
        return Array.from({ length: qty }, () => generateCourier());
    }

    static getOrders(qty) {
        assertValidQty(qty);
        logger.debug(`Generando ${qty} orders simuladas (sin guardar)`);
        return Array.from({ length: qty }, () => generateOrder());
    }

    static getDeliveries(qty) {
        assertValidQty(qty);
        logger.debug(`Generando ${qty} deliveries simuladas (sin guardar)`);
        return Array.from({ length: qty }, () => generateDelivery());
    }

    // ---- Seed: se insertan de verdad en Mongo, con relaciones reales ----
    static async seedUsers(qty) {
        assertValidQty(qty);
        try {
            const users = Array.from({ length: qty }, () => generateUser());
            const inserted = await UserRepository.insertMany(users);
            logger.info(`Seed: se insertaron ${inserted.length} usuarios de prueba`);
            return inserted;
        } catch (error) {
            throw new CustomError({ ...MockError.MockInsertError, cause: error.message });
        }
    }

    static async seedCouriers(qty) {
        assertValidQty(qty);
        try {
            const couriers = Array.from({ length: qty }, () => generateCourier());
            const inserted = await CourierRepository.insertMany(couriers);
            logger.info(`Seed: se insertaron ${inserted.length} couriers de prueba`);
            return inserted;
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

            const inserted = await OrderRepository.insertMany(orders);
            logger.info(`Seed: se insertaron ${inserted.length} orders de prueba`);
            return inserted;
        } catch (error) {
            if (error instanceof CustomError) throw error;
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

            const inserted = await DeliveryRepository.insertMany(deliveries);
            logger.info(`Seed: se insertaron ${inserted.length} deliveries de prueba`);
            return inserted;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError({ ...MockError.MockInsertError, cause: error.message });
        }
    }
}

export default MocksService;