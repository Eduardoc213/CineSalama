# CineDB - Modelos y Configuración de Base de Datos

Este repositorio contiene únicamente los modelos Sequelize y la configuración necesaria para crear la estructura de la base de datos de un sistema de cine. Esto con el fin de que se tenga la estructura de la base de datos, y asi manejar las mismas entidades y atributos en la BD.

## ¿Qué incluye este repositorio inicial?

- Modelos Sequelize para todas las entidades principales del sistema (usuarios, películas, funciones, asientos, ventas, etc.).
- Archivo de configuración para la conexión a la base de datos.
    - Debe implemetarse las variables de entorno en un archivo .env , esto para ocultar los datos de conexion


## Dependencias y paquetes

- npm install dotenv
- npm install nodemailer
- npm install jsonwebtoken
- npm install bcryptjs