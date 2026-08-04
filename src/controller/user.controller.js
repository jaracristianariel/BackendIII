import UserService from '../services/users.service.js';
import { UserError, CustomError } from '../error/CustomError.js';

class UserController {
    static async create(req, res, next) {
        try {

            const { password, email } = req.body;
            const user = await UserService.create(password, email);

            console.log('User creado:', user._id);
            res.status(201).json(user);
        } catch (error) {
            if (error.code == 11000) {
                return next(new CustomError(UserError.DuplicatedKeyError));
            }
            next(error)
        }
    }

    static async getAll(req, res) {
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
}

export default UserController;