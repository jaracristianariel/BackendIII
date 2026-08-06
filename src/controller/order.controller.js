import OrderService from "../services/orders.service.js";
import { CustomError, OrderError } from "../error/CustomError.js";

class OrderController {
    static async create(req, res, next) {
        try {
            const { customerName, customer, address, weight, courierId, items, priority } = req.body;
            const order = await OrderService.create(customerName, customer, address, weight, courierId, items, priority);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const orders = await OrderService.getAll();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const order = await OrderService.getById(req.params.id);
            if (!order) {
                return next(new CustomError(OrderError.OrderNotFoundError));
            }
            res.json(order);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(OrderError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const order = await OrderService.updateStatus(req.params.id, req.body.status);
            res.json(order);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(OrderError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const order = await OrderService.delete(req.params.id);
            if (!order) {
                return next(new CustomError(OrderError.OrderNotFoundError));
            }
            res.status(200).json({ message: 'Pedido eliminado', order });
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(OrderError.ObjectIdParseError));
            }
            next(error);
        }
    }
}

export default OrderController;