import logger from '../config/logger.js';
import { CustomError } from '../error/CustomError.js';

export function errorHandler(err, req, res, next) {
    // Si el error es una instancia de customError

    if (err instanceof CustomError) {
        logger.warning(err);
    } else {
        logger.error(err);
    }

    const statusCode = err.statusCode || 500; // <- ***
    res.status(statusCode).json({ status: 'error', message: err.message, cause: err.cause });
}