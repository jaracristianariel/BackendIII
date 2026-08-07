import logger from "../config/logger.js";

// DEUDA TECNICA (Módulo 2): esto simula una API externa de tracking.
// No llama a ningun proveedor real, inventa un estado en base al id.
function getTrackingStatus(id) {
    const options = ['assigned', 'in_transit', 'out_for_delivery', 'delivered'];
    const index = String(id).length % options.length;
    const status = options[index];

    logger.debug(`Tracking consultado para ${id}: ${status}`);
    return status;
}

export { getTrackingStatus };