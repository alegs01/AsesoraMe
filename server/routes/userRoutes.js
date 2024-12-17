import express from "express";
import {
  register,
  login,
  updateUser,
  getAllUsers,
  logout,
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario.
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario.
 *         password:
 *           type: string
 *           description: Contraseña del usuario.
 *         role:
 *           type: string
 *           enum:
 *             - client
 *             - advisor
 *           description: Rol del usuario (cliente o asesor).
 *         profile:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               description: Primer nombre del usuario.
 *             lastName:
 *               type: string
 *               description: Apellido del usuario.
 *             picture:
 *               type: string
 *               description: URL de la foto de perfil del usuario.
 *             bio:
 *               type: string
 *               description: Biografía del usuario.
 *             specialities:
 *               type: array
 *               items:
 *                 type: string
 *               description: Especialidades del asesor (si aplica).
 *             hourlyRate:
 *               type: number
 *               description: Tarifa por hora del asesor (si aplica).
 *             rating:
 *               type: number
 *               description: Calificación del usuario (por defecto 0).
 *             reviewCount:
 *               type: number
 *               description: Número de reseñas del usuario (por defecto 0).
 *         googleId:
 *           type: string
 *           description: ID de Google del usuario (si se ha autenticado con Google).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha en la que se creó el usuario.
 *       required:
 *         - email
 *         - password
 *         - role
 *       example:
 *         _id: "637bf21f31312991970fdba8"
 *         email: "ejemplo@dominio.com"
 *         password: "password123"
 *         role: "client"
 *         profile:
 *           firstName: "Juan"
 *           lastName: "Pérez"
 *           picture: "https://www.example.com/pic.jpg"
 *           bio: "Asesor con 5 años de experiencia."
 *           specialities: ["Tecnología", "Marketing"]
 *           hourlyRate: 50
 *           rating: 4.5
 *           reviewCount: 10
 *         googleId: "google-id-12345"
 *         createdAt: "2024-12-10T12:00:00Z"
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - client
 *                   - advisor
 *               profile:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   specialities:
 *                     type: array
 *                     items:
 *                       type: string
 *                   hourlyRate:
 *                     type: number
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error al registrar el usuario
 */
router.post("/register", register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Actualizar la información de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - client
 *                   - advisor
 *               profile:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   specialities:
 *                     type: array
 *                     items:
 *                       type: string
 *                   hourlyRate:
 *                     type: number
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos proporcionados
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.put("/update/:id", authMiddleware, updateUser);

/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del usuario
 *                       email:
 *                         type: string
 *                         description: Correo electrónico del usuario
 *                       role:
 *                         type: string
 *                         description: Rol del usuario
 *                       profile:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             description: Primer nombre del usuario
 *                           lastName:
 *                             type: string
 *                             description: Apellido del usuario
 *                           picture:
 *                             type: string
 *                             description: URL de la foto de perfil
 *                           bio:
 *                             type: string
 *                             description: Biografía del usuario
 *                           specialities:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Especialidades del usuario
 *                           hourlyRate:
 *                             type: number
 *                             description: Tarifa por hora (si es asesor)
 *       401:
 *         description: Acceso no autorizado
 *       500:
 *         description: Error del servidor al obtener los usuarios
 */
router.get("/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /api/user/verifytoken:
 *   get:
 *     summary: Verificar el token del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get("/verifytoken", authMiddleware, (req, res) => {
  res.json({ message: "Token is valid" });
});

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *        description: Error interno del servidor
 */
router.post("/logout", authMiddleware, logout);

export default router;
