# Imagen base de Node (version LTS, liviana)
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero solo los archivos de dependencias.
# Esto aprovecha el cache de Docker: si el package.json no cambia,
# no vuelve a instalar todo de nuevo en cada build.
COPY package*.json ./

RUN npm install --omit=dev

# Recien ahora copiamos el resto del codigo fuente
COPY . .

# Puerto en el que escucha la app (coincide con el PORT que uses en produccion)
EXPOSE 8080

# Comando para levantar el servidor
CMD ["node", "src/index.js"]