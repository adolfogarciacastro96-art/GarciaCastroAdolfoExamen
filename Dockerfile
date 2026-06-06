# 1. Imagen base ligera de Node.js
FROM node:18-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos TODOS los archivos de la aplicación al contenedor
# (server.js, index.html, styles.css, script.js)
COPY . .

# 4. Exponemos el puerto 3001 configurado en tu server.js
EXPOSE 3001

# 5. Comando para arrancar tu nuevo servidor
CMD [ "node", "server.js" ]