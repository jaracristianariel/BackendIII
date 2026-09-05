import User from "../models/user.js";

class UserRepository {
    static async create(data) {
        const user = await User.create(data);
        return user;
    }

    // Uso interno (ej: mocks), sin paginar.
    static async find() {
        return await User.find();
    }

    static async findPaginated(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            User.find().skip(skip).limit(limit),
            User.countDocuments(),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
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

    static async addDocument(id, documentMeta) {
        return await User.findByIdAndUpdate(
            id,
            { $push: { documents: documentMeta } },
            { new: true, runValidators: true }
        );
    }

    static async insertMany(users) {
        return await User.insertMany(users);
    }
}

export default UserRepository;