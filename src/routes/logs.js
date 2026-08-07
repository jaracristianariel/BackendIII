import express from "express";
import logger from "../config/logger.js";

const router = express.Router();

// Endpoint interno, no representa una funcionalidad real del negocio.
// Sirve para verificar rapidamente que los 6 niveles del logger funcionan.
router.get('/test', (req, res) => {
    logger.debug('Log de prueba: nivel debug');
    logger.http('Log de prueba: nivel http');
    logger.info('Log de prueba: nivel info');
    logger.warning('Log de prueba: nivel warning');
    logger.error('Log de prueba: nivel error');
    logger.fatal('Log de prueba: nivel fatal');

    res.status(200).json({
        message: 'Se generaron logs de los 6 niveles. Revisa la consola y la carpeta /logs.',
        niveles: ['debug', 'http', 'info', 'warning', 'error', 'fatal'],
    });
});

export default router;