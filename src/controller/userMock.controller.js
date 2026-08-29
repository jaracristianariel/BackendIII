import logger from '../config/logger.js';
import UserRepository from '../repositories/users.repository.js';
import generateUser from '../../test/mocks/usersMock.js';

const isValidCount = (value, min, max) => {
    return Number.isInteger(value) && value >= min && value <= max;
};

class UserMockController {
    static async getAllMocks(req, res, next) {
        try {
            const users = await UserRepository.find();

            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async createMock(req, res, next) {
        try {
            const count = Number(req.body.count) || 10;

            const mockUsers = Array.from({ length: count }, () => generateUser());
            const createdUsers = await UserRepository.insertMany(mockUsers);

            res.status(201).json({ message: 'base de datos poblada' });
        } catch (error) {
            logger.error('Error al crear usuarios de prueba');
            next(error);
        }
    }
}

export default UserMockController;