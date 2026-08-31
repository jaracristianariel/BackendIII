import DeliveryService from "../services/deliveries.service.js";
import { CustomError, DeliveryError } from "../error/CustomError.js";

class DeliveryController {
    static async create(req, res, next) {
        try {
            const { orderId, courierId, status } = req.body;
            const delivery = await DeliveryService.create(orderId, courierId, status);
            res.status(201).json(delivery);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const deliveries = await DeliveryService.getAll();
            res.status(200).json(deliveries);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const result = await DeliveryService.getByIdWithTracking(req.params.id);
            if (!result) {
                return next(new CustomError(DeliveryError.DeliveryNotFoundError));
            }
            res.json(result);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(DeliveryError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const delivery = await DeliveryService.updateStatus(req.params.id, req.body.status);
            res.json(delivery);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(DeliveryError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const delivery = await DeliveryService.delete(req.params.id);
            if (!delivery) {
                return next(new CustomError(DeliveryError.DeliveryNotFoundError));
            }
            res.status(200).json({ message: 'Entrega eliminada', delivery });
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(DeliveryError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async uploadReceipt(req, res, next) {
        try {
            const delivery = await DeliveryService.uploadReceipt(req.params.id, req.file);
            res.status(201).json(delivery);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(DeliveryError.ObjectIdParseError));
            }
            next(error);
        }
    }
}

export default DeliveryController;