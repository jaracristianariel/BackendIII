import dns from 'node:dns';  
import mongoose from 'mongoose';

import config from './config/env.config.js';
import logger from './config/logger.js';

// Fuerza a Node.js a usar los DNS de Google y Cloudflare.
// Se agrega porque el DNS por defecto puede devolver "querySrv ECONNREFUSED"
// al intentar resolver la URI "mongodb+srv://" de MongoDB Atlas.
dns.setServers([
  '8.8.8.8', // Google
  '1.1.1.1', // Cloudflare
]);

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info(`Conectado a MongoDB: ${config.MONGO_URI}`);
  } catch (error) {
    // Manejo de errores crudo: solo logueamos y matamos el proceso.
    if (error.name == 'MongoParseError') {
      logger.fatal('se ha introducido un string de conexión inválido');
    }
    logger.fatal(error.message);
  }
}

export default connectDB;
