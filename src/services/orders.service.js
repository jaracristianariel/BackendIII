import OrderRepository from "../repositories/orders.repository.js";
import { CustomError, OrderError } from "../error/CustomError.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";
import sendNotification from "./notifications.js";
import { assertFilePresent, buildFileMetadata, deleteFileSilently } from "./uploads.service.js";
import { UploadError } from "../error/CustomError.js";

class OrderService {
    static async create(customerName, customer, address, weight, courierId, items, priority) {
        if (!customerName || !address || !weight) {
            throw new CustomError(OrderError.EmptyOrderError);
        }
        if (typeof weight !== 'number' || weight <= 0) {
            throw new CustomError(OrderError.InvalidWeightError);
        }

        const cost = weight * 10;

        const order = await OrderRepository.create({
            customerName,
            customer: customer || null,
            address,
            weight,
            cost,
            status: ORDER_STATUS.PENDING,
            priority: priority || ORDER_PRIORITY.NORMAL,
            items: items || [],
            courierId: courierId || null,
        });

        sendNotification(`Nuevo envio creado para ${customerName} por $${cost}`);

        return order;
    }

    static async getAll() {
        return await OrderRepository.find();
    }

    static async getById(id) {
        return await OrderRepository.findById(id);
    }

    static async updateStatus(id, status) {
        if (!status) {
            throw new CustomError({ ...OrderError.EmptyOrderError, cause: 'No se recibió el status' });
        }
        const order = await OrderRepository.findById(id);
        if (!order) {
            throw new CustomError(OrderError.OrderNotFoundError);
        }
        return await OrderRepository.updateStatus(id, status);
    }

    static async delete(id) {
        return await OrderRepository.deleteById(id);
    }
    
    static async uploadReceipt(id, file) {
        assertFilePresent(file);

        const order = await OrderRepository.findById(id);
        if (!order) {
            deleteFileSilently(file.path);
            throw new CustomError(OrderError.OrderNotFoundError);
        }

        const metadata = buildFileMetadata(file);

        try {
            return await OrderRepository.setReceipt(id, metadata);
        } catch (error) {
            deleteFileSilently(file.path);
            throw new CustomError({ ...UploadError.UploadFailedError, cause: error.message });
        }
    }
}

export default OrderService;