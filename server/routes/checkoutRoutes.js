import express from "express";
import {
  createCheckoutSession,
  createOrder,
  createCart,
  getCart,
  editCart,
} from "../controllers/checkoutController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Cart:
 *      type: object
 *      properties:
 *        products:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              quantity:
 *                type: number
 *              priceID:
 *                type: string
 *              name:
 *                type: string
 *              priceDescription:
 *                type: string
 *              price:
 *                type: number
 *              img:
 *                type: string
 *              slug:
 *                type: string
 *      required:
 *        - products
 *      example:
 *        products:
 *          - quantity: 1
 *            priceID: "1"
 *            name: "Colacao"
 *            priceDescription: "CLP"
 *            price: 1999
 *            img: "url_imagen"
 *            slug: "colacao"
 */

/**
 * @swagger
 * /api/checkout/create-checkout-session:
 *   get:
 *     summary: Crear sesión de pago simulada SIN MERCADOPAGO
 *     description: Crea una sesión de pago para simular el proceso de checkout.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión de pago creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 line_items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 */
router.get("/create-checkout-session", authMiddleware, createCheckoutSession);

/**
 * @swagger
 * /api/checkout/create-order:
 *   post:
 *     summary: Crear una orden de pago con MERCADOPAGO
 *     description: Crea una orden de pago utilizando Mercado Pago y retorna el enlace de pago.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del comprador.
 *               items:
 *                 type: array
 *                 description: Lista de productos para la orden.
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Nombre del producto.
 *                     quantity:
 *                       type: integer
 *                       description: Cantidad del producto.
 *                     unit_price:
 *                       type: number
 *                       description: Precio unitario del producto.
 *     responses:
 *       200:
 *         description: Orden de pago creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 init_point:
 *                   type: string
 *                   description: URL para iniciar el pago en Mercado Pago.
 *       400:
 *         description: Datos insuficientes o solicitud inválida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error relacionado con los datos enviados.
 *       500:
 *         description: Error interno del servidor, formato de JSON incorrecto o token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error general.
 *                 error:
 *                   type: object
 *                   description: Detalle del error.
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Mensaje del error específico (ej. "invalid_token" o "Bad JSON format").
 *                     status:
 *                       type: integer
 *                       description: Código de estado HTTP relacionado con el error.
 *                     details:
 *                       type: string
 *                       description: Información adicional sobre el error.
 */
router.post("/create-order", authMiddleware, createOrder);

/**
 * @swagger
 * /api/checkout/create-cart:
 *   post:
 *     summary: Crear un nuevo carrito de compras
 *     description: Crea un carrito de compras en la base de datos.
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Carrito creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 */
router.post("/create-cart", authMiddleware, createCart);

/**
 * @swagger
 * /api/checkout/get-cart:
 *   get:
 *     summary: Obtener carrito de compras
 *     description: Obtiene el carrito asociado al usuario autenticado.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito de compras encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get("/get-cart", authMiddleware, getCart);

/**
 * @swagger
 * /api/checkout/edit-cart:
 *   put:
 *     summary: Editar carrito de compras
 *     description: Edita los productos en el carrito de compras del usuario autenticado.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Carrito de compras actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 updatedCart:
 *                   $ref: '#/components/schemas/Cart'
 */
router.put("/edit-cart", authMiddleware, editCart);

export default router;
