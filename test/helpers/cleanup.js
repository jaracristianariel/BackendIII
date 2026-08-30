import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import Courier from '../../src/models/courier.js';
import Order from '../../src/models/order.js';
import Delivery from '../../src/models/delivery.js';

async function cleanDatabase() {
    await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Courier.deleteMany({}),
        Order.deleteMany({}),
        Delivery.deleteMany({}),
    ]);
}

export { cleanDatabase };