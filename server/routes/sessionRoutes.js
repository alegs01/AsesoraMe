import express from "express";
import {
  createSession,
  getAllSessions,
  getSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la sesión.
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
 *           type: number
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
 *               description: Monto del pago.
 *             status:
 *               type: string
 *               enum: ["pending", "completed", "refunded"]
 *               description: Estado del pago.
 *             transactionId:
 *               type: string
 *               description: ID de la transacción de pago.
 *         notes:
 *           type: string
 *           description: Notas de la sesión.
 *         rating:
 *           type: object
 *           properties:
 *             score:
 *               type: number
 *               description: Calificación de la sesión.
 *             review:
 *               type: string
 *               description: Reseña de la sesión.
 *       required:
 *         - advisor
 *         - client
 *         - startTime
 *         - duration
 *         - status
 *       example:
 *         _id: 637bf21f31312991970fdba8
 *         advisor: "5f8d0d55b54764421b7e6d45"
 *         client: "5f8d0d55b54764421b7e6d46"
 *         startTime: "2024-12-11T14:00:00Z"
 *         duration: 60
 *         status: "scheduled"
 *         payment:
 *           amount: 10000
 *           status: "pending"
 *           transactionId: "txn12345"
 *         notes: "Cliente quiere discutir temas sobre finanzas."
 *         rating:
 *           score: 5
 *           review: "Excelente sesión, muy útil."
 */

/**
 * @swagger
 * /api/session/create:
 *   post:
 *     summary: Crear una nueva sesión
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               advisor:
 *                 type: string
 *               client:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *               payment:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   transactionId:
 *                     type: string
 *               notes:
 *                 type: string
 *               rating:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: number
 *                   review:
 *                     type: string
 *     responses:
 *       201:
 *         description: Sesión creada exitosamente
 *       400:
 *         description: Error al crear la sesión
 */
router.post("/create", authMiddleware, createSession);

/**
 * @swagger
 * /api/session/{id}:
 *   put:
 *     summary: Actualizar una sesión por ID
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               advisor:
 *                 type: string
 *               client:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *               payment:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   transactionId:
 *                     type: string
 *               notes:
 *                 type: string
 *               rating:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: number
 *                   review:
 *                     type: string
 *     responses:
 *       200:
 *         description: Sesión actualizada con éxito
 *       404:
 *         description: Sesión no encontrada
 *       400:
 *         description: Error al actualizar la sesión
 *       500:
 *         description: Error al actualizar la sesión
 */
router.put("/:id", authMiddleware, updateSession);

/**
 * @swagger
 * /api/session/{id}:
 *   get:
 *     summary: Obtener una sesión por ID
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la sesión
 *     responses:
 *       200:
 *         description: Sesión encontrada con éxito
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error al obtener la sesión
 */
router.get("/:id", getSession);

/**
 * @swagger
 * /api/session:
 *   get:
 *     summary: Obtener todas las sesiones
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sesiones obtenida con éxito
 *       500:
 *         description: Error al obtener las sesiones
 */
router.get("/", getAllSessions);

/**
 * @swagger
 * /api/session/{id}:
 *   delete:
 *     summary: Eliminar una sesión por ID
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la sesión a eliminar
 *     responses:
 *       200:
 *         description: Sesión eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión eliminada con éxito
 *                 session:
 *                   type: object
 *                   description: Información de la sesión eliminada
 *       404:
 *         description: Sesión no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión no encontrada
 *       400:
 *         description: ID de sesión no válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID de sesión no válido
 *       500:
 *         description: Error al eliminar la sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la sesión
 *                 error:
 *                   type: string
 *                   description: Detalle del error
 */
router.delete("/:id", authMiddleware, deleteSession);

export default router;
