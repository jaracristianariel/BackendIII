import app from './app.js';
import connectDB from './db.js';
import config from './config/env.config.js';
import logger from './config/logger.js';

connectDB();

app.listen(config.PORT, () => {
  logger.info(`ShipNow escuchando en el puerto ${config.PORT}`);
});