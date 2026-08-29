import express from "express";
import logger from "../config/logger.js";

const router = express.Router();

/**
 * @swagger
 * /api/logs/test:
 *   get:
 *     tags: [Logger]
 *     summary: Dispara un log de cada nivel (debug, http, info, warning, error, fatal)
 *     description: >
 *       Endpoint interno de validación. No representa una funcionalidad real del negocio,
 *       solo sirve para confirmar rápidamente que el logger está bien configurado
 *       (revisar la consola y la carpeta /logs después de llamarlo).
 *     responses:
 *       200:
 *         description: Se generaron los logs correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Se generaron logs de los 6 niveles. Revisa la consola y la carpeta /logs." }
 *                 niveles:
 *                   type: array
 *                   items: { type: string }
 *                   example: [debug, http, info, warning, error, fatal]
 */
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