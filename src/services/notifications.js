import logger from "../config/logger.js";

// DEUDA TECNICA (Módulo 1): esto simula un servicio externo de notificaciones
// (mail, sms, etc). No llama a ningun proveedor real.
function sendNotification(message) {
    logger.info(`Notificacion enviada: ${message}`);
}

export default sendNotification;