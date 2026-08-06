import CourierService from "../services/couriers.service.js";
import { CustomError, CourierError } from "../error/CustomError.js";

class CourierController {
    static async create(req, res, next) {
        try {
            const { name, zone, available } = req.body;
            const courier = await CourierService.create(name, zone, available);
            res.status(201).json(courier);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const couriers = await CourierService.getAll();
            res.status(200).json(couriers);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const courier = await CourierService.getById(req.params.id);
            if (!courier) {
                return next(new CustomError(CourierError.CourierNotFoundError));
            }
            res.json(courier);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(CourierError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { name, zone, available } = req.body;
            const courier = await CourierService.update(req.params.id, name, zone, available);
            if (!courier) {
                return next(new CustomError(CourierError.CourierNotFoundError));
            }
            res.json(courier);
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(CourierError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const courier = await CourierService.delete(req.params.id);
            if (!courier) {
                return next(new CustomError(CourierError.CourierNotFoundError));
            }
            res.status(200).json({ message: 'Repartidor eliminado', courier });
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(CourierError.ObjectIdParseError));
            }
            next(error);
        }
    }
}

export default CourierController;