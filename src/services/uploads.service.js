import fs from 'fs';
import { CustomError, UploadError } from '../error/CustomError.js';

function assertFilePresent(file) {
    if (!file) {
        throw new CustomError(UploadError.FileRequiredError);
    }
}

function buildFileMetadata(file) {
    return {
        originalName: file.originalname,
        generatedName: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
        uploadedAt: new Date(),
    };
}

// Borra el archivo ya guardado en disco si algo falla despues
// (ej: la entidad no existe, o falla el guardado en Mongo).
// No bloqueamos la respuesta esperando esto, es "best effort".
function deleteFileSilently(filePath) {
    if (!filePath) return;
    fs.unlink(filePath, () => { });
}

export { assertFilePresent, buildFileMetadata, deleteFileSilently };