import UserRepository from "../repositories/users.repository.js";
import { CustomError, UserError } from "../error/CustomError.js";
import { USER_ROLES } from "../constants/index.js";
import { DOCUMENT_TYPES } from "../constants/index.js";
import { assertFilePresent, buildFileMetadata, deleteFileSilently } from "./uploads.service.js";
import { UploadError } from "../error/CustomError.js";

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

    static async getAll(page, limit) {
        return await UserRepository.findPaginated(page, limit);
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

    static async uploadDocument(id, file, documentType) {
        assertFilePresent(file);

        if (documentType && !Object.values(DOCUMENT_TYPES).includes(documentType)) {
            deleteFileSilently(file.path);
            throw new CustomError(UploadError.InvalidDocumentTypeError);
        }

        const user = await UserRepository.findById(id);
        if (!user) {
            deleteFileSilently(file.path);
            throw new CustomError(UserError.UserNotFoundError);
        }

        const metadata = {
            ...buildFileMetadata(file),
            documentType: documentType || DOCUMENT_TYPES.OTHER,
        };

        try {
            return await UserRepository.addDocument(id, metadata);
        } catch (error) {
            deleteFileSilently(file.path);
            throw new CustomError({ ...UploadError.UploadFailedError, cause: error.message });
        }
    }
}

export default UserService;