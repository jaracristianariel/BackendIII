import UserService from "../services/users.service.js";
import logger from "../config/logger.js";
import { UserError, CustomError } from "../error/CustomError.js";

class UserController {
    static async create(req, res, next) {
        try {
            const { first_name, last_name, email, password, role } = req.body;
            const user = await UserService.create(first_name, last_name, email, password, role);

            logger.info(`User creado: ${user._id}`);
            res.status(201).json(user);
        } catch (error) {
            if (error.code == 11000) {
                return next(new CustomError(UserError.DuplicatedKeyError));
            }
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const users = await UserService.getAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const user = await UserService.getById(req.params.id);
            if (!user) {
                return next(new CustomError(UserError.UserNotFoundError));
            }
            res.json(user);
        } catch (error) {
            if (error.name == "CastError") {
                return next(new CustomError(UserError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { first_name, last_name, email, password, role } = req.body;
            const user = await UserService.update(req.params.id, first_name, last_name, email, password, role);
            if (!user) {
                return next(new CustomError(UserError.UserNotFoundError));
            }
            res.json(user);
        } catch (error) {
            if (error.code == 11000) {
                return next(new CustomError(UserError.DuplicatedKeyError));
            }
            if (error.name === 'CastError') {
                return next(new CustomError(UserError.ObjectIdParseError));
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const user = await UserService.delete(req.params.id);
            if (!user) {
                return next(new CustomError(UserError.UserNotFoundError));
            }
            res.status(200).json({ message: 'Usuario eliminado', user });
        } catch (error) {
            if (error.name === 'CastError') {
                return next(new CustomError(UserError.ObjectIdParseError));
            }
            next(error);
        }
    }
}

export default UserController;