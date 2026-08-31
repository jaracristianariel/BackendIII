import multer from "multer";
import logger from "../config/logger.js";
import { CustomError, UploadError } from "../error/CustomError.js";

export function errorHandler(err, req, res, next) {
    let finalError = err;

    // Multer larga sus propios errores (no son CustomError todavia).
    // Los traducimos aca, en la capa comun, para que la respuesta sea uniforme.
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        finalError = new CustomError(UploadError.FileTooLargeError);
    } else if (err.message === 'INVALID_FILE_TYPE') {
        finalError = new CustomError(UploadError.InvalidFileTypeError);
    }

    if (finalError instanceof CustomError) {
        logger.warning(finalError);
    } else {
        logger.error(finalError);
    }

    const statusCode = finalError.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: finalError.message, cause: finalError.cause });
}