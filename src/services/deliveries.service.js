import DeliveryRepository from "../repositories/deliveries.repository.js";
import OrderRepository from "../repositories/orders.repository.js";
import CourierRepository from "../repositories/couriers.repository.js";
import { CustomError, DeliveryError, OrderError, CourierError } from "../error/CustomError.js";
import { DELIVERY_STATUS } from "../constants/index.js";
import { getTrackingStatus } from "./trackingProvider.js";
import { assertFilePresent, buildFileMetadata, deleteFileSilently } from "./uploads.service.js";
import { UploadError } from "../error/CustomError.js";

class DeliveryService {
    static async create(orderId, courierId, status) {
        if (!orderId || !courierId) {
            throw new CustomError(DeliveryError.EmptyDeliveryError);
        }

        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new CustomError(OrderError.OrderNotFoundError);
        }
        const courier = await CourierRepository.findById(courierId);
        if (!courier) {
            throw new CustomError(CourierError.CourierNotFoundError);
        }

        return await DeliveryRepository.create({
            orderId,
            courierId,
            status: status || DELIVERY_STATUS.ASSIGNED,
            assignedAt: new Date(),
        });
    }

    static async getAll(page, limit) {
        return await DeliveryRepository.findPaginated(page, limit);
    }

    static async getByIdWithTracking(id) {
        const delivery = await DeliveryRepository.findById(id);
        if (!delivery) {
            return null;
        }
        const trackingStatus = getTrackingStatus(delivery._id);
        return { delivery, tracking: { status: trackingStatus } };
    }

    static async updateStatus(id, status) {
        if (!status) {
            throw new CustomError({ ...DeliveryError.EmptyDeliveryError, cause: 'No se recibió el status' });
        }
        const delivery = await DeliveryRepository.findById(id);
        if (!delivery) {
            throw new CustomError(DeliveryError.DeliveryNotFoundError);
        }
        return await DeliveryRepository.updateStatus(id, status);
    }

    static async delete(id) {
        return await DeliveryRepository.deleteById(id);
    }

    static async uploadReceipt(id, file) {
        assertFilePresent(file);

        const delivery = await DeliveryRepository.findById(id);
        if (!delivery) {
            deleteFileSilently(file.path);
            throw new CustomError(DeliveryError.DeliveryNotFoundError);
        }

        const metadata = buildFileMetadata(file);

        try {
            return await DeliveryRepository.setReceipt(id, metadata);
        } catch (error) {
            deleteFileSilently(file.path);
            throw new CustomError({ ...UploadError.UploadFailedError, cause: error.message });
        }
    }
}

export default DeliveryService;