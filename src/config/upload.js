import multer from 'multer';
import fs from 'fs';
import { resolveFromRoot } from '../utils/paths.js';

const UPLOADS_ROOT = resolveFromRoot(import.meta.url, '../../uploads');

const FOLDERS = {
    userDocuments: `${UPLOADS_ROOT}/user-documents`,
    receipts: `${UPLOADS_ROOT}/receipts`,
};

// Nos aseguramos de que las carpetas existan al arrancar la app
// (si no, Multer no puede escribir el archivo ahí).
Object.values(FOLDERS).forEach((folder) => {
    fs.mkdirSync(folder, { recursive: true });
});

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function buildStorage(destinationFolder) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const extension = file.originalname.split('.').pop();
            cb(null, `${uniqueSuffix}.${extension}`);
        },
    });
}

function fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        // Este error lo intercepta el middleware de errores mas adelante.
        return cb(new Error('INVALID_FILE_TYPE'));
    }
    cb(null, true);
}

const uploadUserDocument = multer({
    storage: buildStorage(FOLDERS.userDocuments),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

const uploadReceipt = multer({
    storage: buildStorage(FOLDERS.receipts),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

export { uploadUserDocument, uploadReceipt, FOLDERS };