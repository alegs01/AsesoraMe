# Backend Authentication

Este es un proyecto de backend para autenticación de usuarios con funcionalidad de registro, inicio de sesión, y gestión de órdenes usando Mercado Pago. Utiliza tecnologías como Node.js, Express, MongoDB, y JWT para la autenticación.

## Tecnologías Utilizadas

- **Node.js**: JavaScript runtime para construir el servidor backend.
- **Express**: Framework para manejar rutas y peticiones HTTP.
- **MongoDB**: Base de datos NoSQL para almacenar usuarios y datos relacionados.
- **JWT (JSON Web Token)**: Utilizado para la autenticación de usuarios.
- **Bcryptjs**: Para encriptar las contraseñas de los usuarios.
- **Mercado Pago**: API de pagos para la gestión de órdenes y procesamiento de pagos.

## Funcionalidades

- **Autenticación de Usuario**: Registro, inicio de sesión y protección de rutas usando JWT.
- **Gestión de Carrito**: Los usuarios pueden agregar productos al carrito y proceder a la compra.
- **Integración con Mercado Pago**: Creación de órdenes de pago a través de la API de Mercado Pago.
  
## Endpoints

### Usuario

`POST /api/user/register`
`POST /api/user/login`
`PUT /api/user/update/{id}`
`GET /api/user/`
`GET /api/user/verifytoken`

### Productos

`POST /api/product/create`
`PUT /api/product/{id}`
`GET /api/product/{id}`
`GET /api/product`
`DELETE /api/product/{id}`

### Checkout

`GET /api/checkout/create-checkout-session`
`POST /api/checkout/create-order`
`POST /api/checkout/create-cart`
`GET /api/checkout/get-cart`
`PUT /api/checkout/edit-cart`

## Instalación

## 1. Clonar el repositorio

`git clone https://github.com/tu-usuario/backend_auth.git
cd backend_auth`

## 2. Instalar las dependencias

`npm install`

## 3. Configurar las variables de entorno

Crea un archivo .env en la raíz del proyecto y agrega tus configuraciones:

`MP_ACCESS_TOKEN=tu_access_token_de_mercado_pago
JWT_SECRET=tu_clave_secreta_de_jwt
MONGO_URI=tu_uri_de_mongo`

## 4. Inicia el servidor

`npm start`

## 5. Accede a la interfaz de swagger

`api-docs`
