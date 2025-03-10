#Definir el tipo de aplicación que vamos a construir.
FROM node

#Definir donde se va a guardar el nombre del proyecto/imágen.
WORKDIR /backend-iii-lozzanomartin

#"mover" los package.json a la carpeta del contenedor.
COPY package*.json ./

#Instalar los módulos.
RUN npm install

#"mover" el resto de archivos de la app.
COPY ./ ./

#Configuramos el puerto de exposición (puerto en el que se va a levantar el servidor).
EXPOSE 8080

#Configuramos el comando de inicialización de la app.
CMD ["npm", "run", "dev"]