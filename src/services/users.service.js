import UserRepository from '../repositories/users.repository.js';

class UserService {
    static async create(password, email) {

        if (!password || !email) {
            // habria que hacer este error personalizado tambien
            throw new Error('Faltan datos obligatorios del usuario');
        }
        // TODO: validar rol si es correcto
        const user = await UserRepository.create(password, email);
        return user;
    }

    static async getAll() {
        return await UserRepository.find();
    }

    static async getById(id) {
        return await UserRepository.findById(id);
    }
}

export default UserService;