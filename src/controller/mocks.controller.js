import MocksService from '../services/mocks.service.js';

const DEFAULT_QTY = 10;
const MAX_QTY = 100;

function parseQty(req) {
    const qty = Number(req.query.qty) || DEFAULT_QTY;
    return Math.min(Math.max(qty, 1), MAX_QTY);
}

class MocksController {
    static getUsers(req, res, next) {
        try {
            res.status(200).json(MocksService.getUsers(parseQty(req)));
        } catch (error) { next(error); }
    }

    static getCouriers(req, res, next) {
        try {
            res.status(200).json(MocksService.getCouriers(parseQty(req)));
        } catch (error) { next(error); }
    }

    static getOrders(req, res, next) {
        try {
            res.status(200).json(MocksService.getOrders(parseQty(req)));
        } catch (error) { next(error); }
    }

    static getDeliveries(req, res, next) {
        try {
            res.status(200).json(MocksService.getDeliveries(parseQty(req)));
        } catch (error) { next(error); }
    }

    static async seedUsers(req, res, next) {
        try {
            const inserted = await MocksService.seedUsers(parseQty(req));
            res.status(201).json({ insertados: inserted.length, coleccion: 'usuarios' });
        } catch (error) { next(error); }
    }

    static async seedCouriers(req, res, next) {
        try {
            const inserted = await MocksService.seedCouriers(parseQty(req));
            res.status(201).json({ insertados: inserted.length, coleccion: 'couriers' });
        } catch (error) { next(error); }
    }

    static async seedOrders(req, res, next) {
        try {
            const inserted = await MocksService.seedOrders(parseQty(req));
            res.status(201).json({ insertados: inserted.length, coleccion: 'orders' });
        } catch (error) { next(error); }
    }

    static async seedDeliveries(req, res, next) {
        try {
            const inserted = await MocksService.seedDeliveries(parseQty(req));
            res.status(201).json({ insertados: inserted.length, coleccion: 'deliveries' });
        } catch (error) { next(error); }
    }
}

export default MocksController;