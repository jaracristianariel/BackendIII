import UserRepository from "../repositories/users.repository.js";
import { CustomError, UserError } from "../error/CustomError.js";
import { USER_ROLES } from "../constants/index.js";

class UserService {
    static async create(first_name, last_name, email, password, role) {
        if (!password || !email) {
            throw new CustomError(UserError.EmptyUserError);
        }

        if (role && !Object.values(USER_ROLES).includes(role)) {
            throw new CustomError(UserError.InvalidRoleError);
        }

        const user = await UserRepository.create({
            first_name,
            last_name,
            email,
            password,
            role: role || USER_ROLES.USER,
        });

        return user;
    }

    static async getAll() {
        return await UserRepository.find();
    }

    static async getById(id) {
        return await UserRepository.findById(id);
    }

    static async update(id, first_name, last_name, email, password, role) {
        if (role && !Object.values(USER_ROLES).includes(role)) {
            throw new CustomError(UserError.InvalidRoleError);
        }

        const data = {};
        if (first_name !== undefined) data.first_name = first_name;
        if (last_name !== undefined) data.last_name = last_name;
        if (email !== undefined) data.email = email;
        if (password !== undefined) data.password = password;
        if (role !== undefined) data.role = role;

        return await UserRepository.updateById(id, data);
    }

    static async delete(id) {
        return await UserRepository.deleteById(id);
    }
}

export default UserService;