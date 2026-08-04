import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { USER_ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../../src/constants/index.js';

function generateUser() {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(Object.values(USER_ROLES)),
    };
}

function generateCourier() {
    return {
        name: faker.person.fullName(),
        zone: faker.location.city(),
        available: faker.datatype.boolean(),
    };
}

function generateOrder(customerId) {
    const weight = faker.number.int({ min: 1, max: 50 });
    return {
        customerName: faker.person.fullName(),
        customer: customerId || new mongoose.Types.ObjectId(),
        address: faker.location.streetAddress(),
        weight,
        cost: weight * 10,
        status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
        priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
        items: [{
            name: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 5 }),
            price: Number(faker.commerce.price()),
        }],
    };
}

function generateDelivery(orderId, courierId) {
    return {
        orderId: orderId || new mongoose.Types.ObjectId(),
        courierId: courierId || new mongoose.Types.ObjectId(),
        status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS)),
        assignedAt: faker.date.recent(),
    };
}

export { generateUser, generateCourier, generateOrder, generateDelivery };