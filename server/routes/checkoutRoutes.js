import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  createCartPaymentLink,
} from "../controllers/checkoutController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           description: ID de la sesión agregada al carrito.
 *         quantity:
 *           type: integer
 *           description: Cantidad de la sesión.
 *       required:
 *         - sessionId
 *         - quantity
 *       example:
 *         sessionId: "64f8c6ef5f12b8ecf8e2135b"
 *         quantity: 2
 *     Cart:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario propietario del carrito.
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 *           description: Precio total de las sesiones en el carrito.
 *       required:
 *         - userId
 *         - items
 *       example:
 *         userId: "64f8c7af5f12b8ecf8e2135c"
 *         items:
 *           - sessionId: "64f8c6ef5f12b8ecf8e2135b"
 *             quantity: 2
 */

/**
 * @swagger
 * /api/checkout/cart:
 *   get:
 *     summary: Obtener el carrito del usuario
 *     description: Devuelve el carrito actual del usuario autenticado.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrito no encontrado.
 */
router.get("/cart", authMiddleware, getCart);

/**
 * @swagger
 * /api/checkout/cart:
 *   post:
 *     summary: Agregar una sesion al carrito
 *     description: Añade una sesion al carrito del usuario autenticado.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
 *         description: Sesion agregada al carrito exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Datos insuficientes o solicitud inválida.
 */
router.post("/cart", authMiddleware, addToCart);

/**
 * @swagger
 * /api/checkout/cart:
 *   delete:
 *     summary: Eliminar un sesion del carrito
 *     description: Elimina un sesion específico del carrito del usuario autenticado.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID de la sesion a eliminar.
 *             required:
 *               - sessionId
 *             example:
 *               sessionId: "64f8c6ef5f12b8ecf8e2135b"
 *     responses:
 *       200:
 *         description: sesion eliminada del carrito exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: sesion no encontrada en el carrito.
 */
router.delete("/cart/:id", authMiddleware, removeFromCart);

/**
 * @swagger
 * /api/checkout/payment-link:
 *   post:
 *     summary: Crear un enlace de pago
 *     description: Genera un enlace de pago para el contenido del carrito del usuario.
 *     tags: [Payments]
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
 *                 description: Correo electrónico del usuario.
 *             required:
 *               - email
 *             example:
 *               email: "usuario@correo.com"
 *     responses:
 *       201:
 *         description: Enlace de pago generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentLink:
 *                   type: string
 *                   description: URL del enlace de pago.
 *       400:
 *         description: Datos insuficientes o solicitud inválida.
 */
router.post("/payment-link", authMiddleware, createCartPaymentLink);

export default router;
