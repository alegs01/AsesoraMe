import express from "express";
import {
  createSession,
  getUserSessions,
  updateSessionStatus,
  createPaymentLink,
} from "../controllers/checkoutController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       properties:
 *         advisor:
 *           type: string
 *           description: ID del asesor.
 *         client:
 *           type: string
 *           description: ID del cliente.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de inicio de la sesión.
 *         duration:
 *           type: integer
 *           description: Duración de la sesión en minutos.
 *         status:
 *           type: string
 *           enum: ["scheduled", "completed", "cancelled"]
 *           description: Estado de la sesión.
 *         payment:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             status:
 *               type: string
 *               enum: ["pending", "completed", "refunded"]
 *             transactionId:
 *               type: string
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre la sesión.
 *         rating:
 *           type: object
 *           properties:
 *             score:
 *               type: number
 *             review:
 *               type: string
 *       required:
 *         - advisor
 *         - client
 *         - startTime
 *         - duration
 *       example:
 *         advisor: "64f8c6ef5f12b8ecf8e2135b"
 *         client: "64f8c7af5f12b8ecf8e2135c"
 *         startTime: "2024-12-11T10:00:00Z"
 *         duration: 60
 *         status: "scheduled"
 *         payment:
 *           amount: 10000
 *           status: "pending"
 *           transactionId: "txn_12345"
 *         notes: "Primera sesión de consulta."
 *         rating:
 *           score: 5
 *           review: "Excelente asesoramiento."
 */

/**
 * @swagger
 * /api/checkout/session:
 *   post:
 *     summary: Crear una nueva sesión
 *     description: Crea una nueva sesión entre un cliente y un asesor.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       201:
 *         description: Sesión creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Datos insuficientes o solicitud inválida.
 */
router.post("/session", authMiddleware, createSession);

/**
 * @swagger
 * /api/checkout/sessions:
 *   get:
 *     summary: Obtener sesiones del usuario
 *     description: Devuelve todas las sesiones asociadas al usuario autenticado.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sesiones encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 */
router.get("/sessions", authMiddleware, getUserSessions);

/**
 * @swagger
 * /api/checkout/session/status:
 *   patch:
 *     summary: Actualizar el estado de una sesión
 *     description: Actualiza el estado de una sesión específica.
 *     tags: [Sessions]
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
 *                 description: ID de la sesión a actualizar.
 *               status:
 *                 type: string
 *                 enum: ["scheduled", "completed", "cancelled"]
 *                 description: Nuevo estado de la sesión.
 *     responses:
 *       200:
 *         description: Estado de la sesión actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.patch("/session/status", authMiddleware, updateSessionStatus);

/**
 * @swagger
 * /api/checkout/payment-link:
 *   post:
 *     summary: Crear un enlace de pago
 *     description: Genera un enlace de pago para una sesión específica.
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
 *               sessionId:
 *                 type: string
 *                 description: ID de la sesión asociada al pago.
 *               email:
 *                 type: string
 *                 description: Email del usuario.
 *     responses:
 *       201:
 *         description: Enlace de pago creado exitosamente.
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
router.post("/payment-link", authMiddleware, createPaymentLink);

export default router;
