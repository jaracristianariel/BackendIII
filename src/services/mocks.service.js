import { generateUser, generateCourier, generateOrder, generateDelivery } from '../../test/mocks/generators.js';
import UserRepository from '../repositories/users.repository.js';
import CourierRepository from '../repositories/couriers.repository.js';
import OrderRepository from '../repositories/orders.repository.js';
import DeliveryRepository from '../repositories/deliveries.repository.js';

class MocksService {
    // ---- Simulados: NO se guardan en la base ----
    static getUsers(qty) {
        return Array.from({ length: qty }, () => generateUser());
    }

    static getCouriers(qty) {
        return Array.from({ length: qty }, () => generateCourier());
    }

    static getOrders(qty) {
        return Array.from({ length: qty }, () => generateOrder());
    }

    static getDeliveries(qty) {
        return Array.from({ length: qty }, () => generateDelivery());
    }

    // ---- Seed: se insertan de verdad en Mongo, con relaciones reales ----
    static async seedUsers(qty) {
        const users = Array.from({ length: qty }, () => generateUser());
        return await UserRepository.insertMany(users);
    }

    static async seedCouriers(qty) {
        const couriers = Array.from({ length: qty }, () => generateCourier());
        return await CourierRepository.insertMany(couriers);
    }

    static async seedOrders(qty) {
        let users = await UserRepository.find();
        if (users.length === 0) {
            users = await this.seedUsers(5);
        }

        const orders = Array.from({ length: qty }, () => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            return generateOrder(randomUser._id);
        });

        return await OrderRepository.insertMany(orders);
    }

    static async seedDeliveries(qty) {
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
    }
}

export default MocksService;