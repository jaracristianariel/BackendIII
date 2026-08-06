import User from "../models/user.js";

class UserRepository {
    static async create(data) {
        const user = await User.create(data);
        return user;
    }

    static async find() {
        return await User.find();
    }

    static async findById(id) {
        return await User.findById(id);
    }

    static async updateById(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    static async deleteById(id) {
        return await User.findByIdAndDelete(id);
    }

    static async insertMany(users) {
        return await User.insertMany(users);
    }
}

export default UserRepository;