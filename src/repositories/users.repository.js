import User from '../models/user.js';

class UserRepository {
    static async create(password, email) {
        console.log(email, password);

        const user = await User.create({
            password,
            email,
        });

        return user;
    }

    static async find() {
        return await User.find();
    }

    static async findById(id) {
        return await User.findById(id);
    }

    static async insertMany(users) {
        return await User.insertMany(users);
    }
}

export default UserRepository;