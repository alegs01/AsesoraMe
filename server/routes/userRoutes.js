import express from "express";
import {
  register,
  login,
  updateUser,
  getAllUsers,
  profile,
  userById,
  getAdvisors,
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
 * /api/user/id/{id}:
 *   get:
 *     summary: Obtener información de un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID único del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del usuario
 *                 email:
 *                   type: string
 *                   description: Correo del usuario
 *                 role:
 *                   type: string
 *                   description: Rol del usuario
 *                 profile:
 *                   type: object
 *                   description: Detalles del perfil del usuario
 *       401:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener la información del usuario
 */
router.get("/id/:id", authMiddleware, userById);

/**
 * @swagger
 * /api/user/advisors:
 *   get:
 *     summary: Obtener lista de usuarios con rol de asesor
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de asesores obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del asesor
 *                   email:
 *                     type: string
 *                     description: Correo del asesor
 *                   profile:
 *                     type: object
 *                     description: Detalles del perfil del asesor
 *       404:
 *         description: No se encontraron asesores
 *       500:
 *         description: Error al obtener la lista de asesores
 */
router.get("/advisors", getAdvisors);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Actualizar el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Primer nombre del usuario
 *               lastName:
 *                 type: string
 *                 description: Apellido del usuario
 *               avatar:
 *                 type: string
 *                 description: URL de la foto de perfil
 *               bio:
 *                 type: string
 *                 description: Biografía del usuario
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Especialidades del usuario
 *               hourlyRate:
 *                 type: number
 *                 description: Tarifa por hora del usuario (si aplica)
 *     responses:
 *       200:
 *         description: Perfil actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID del usuario
 *                     firstName:
 *                       type: string
 *                       description: Primer nombre del usuario
 *                     lastName:
 *                       type: string
 *                       description: Apellido del usuario
 *                     profile:
 *                       type: object
 *                       properties:
 *                         picture:
 *                           type: string
 *                           description: URL de la foto de perfil
 *                         bio:
 *                           type: string
 *                           description: Biografía del usuario
 *                         specialities:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Especialidades del usuario
 *                         hourlyRate:
 *                           type: number
 *                           description: Tarifa por hora del usuario
 *       400:
 *         description: Datos de solicitud no válidos
 *       401:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el perfil
 */
router.put("/profile", authMiddleware, profile);

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

export default router;
