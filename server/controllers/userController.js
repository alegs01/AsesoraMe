import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, role, firstName, lastName } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Crea el objeto con los datos del nuevo usuario
    const newUserData = new User({
      email,
      password, // Contraseña sin encriptar, será encriptada por el middleware
      role,
      firstName,
      lastName,
    });

    // Guarda el nuevo usuario en la base de datos
    await newUserData.save();
    console.log(newUserData);

    // Responde con éxito al cliente
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUserData });
  } catch (error) {
    // En caso de error, responde con un mensaje de error
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Intento de inicio de sesión con email:", email);

    // Busca el usuario por email y verifica la contraseña en una sola línea
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Credenciales inválidas");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Genera el token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Inicio de sesión exitoso para usuario:", user._id);

    res.json({ token: token, user: user });
  } catch (error) {
    console.error("Error en el proceso de inicio de sesión:", error);
    res.status(400).json({ message: "Error logging in", error });
  }
};

// Función para actualizar los datos de un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    password,
    picture,
    bio,
    specialties,
    hourlyRate,
    availability,
  } = req.body;

  try {
    // Crea un objeto con los datos que serán actualizados
    const updateData = {
      profile: {}, // Se guarda dentro de un subobjeto 'profile'
    };

    // Actualiza los campos comunes
    if (firstName) updateData.profile.firstName = firstName;
    if (lastName) updateData.profile.lastName = lastName;
    if (email) updateData.email = email;

    // Si el usuario envía una nueva contraseña, la encripta y la actualiza
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Actualiza los campos de perfil que corresponden
    if (picture) updateData.profile.picture = picture;
    if (bio) updateData.profile.bio = bio;
    if (specialties) updateData.profile.specialties = specialties;
    if (hourlyRate) updateData.profile.hourlyRate = hourlyRate;

    // Actualiza el campo disponibilidad
    if (availability) updateData.availability = availability;

    // Busca y actualiza el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Retorna el documento actualizado
      runValidators: true, // Aplica las validaciones definidas en el modelo
    });

    // Si no se encuentra el usuario, responde con error
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Responde con el usuario actualizado
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    // En caso de error, responde con un mensaje de error
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Error updating user", error });
  }
};

// Función para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    // Obtiene todos los usuarios de la base de datos
    const users = await User.find();

    // Responde con la lista de usuarios
    res.status(200).json({
      message: "Lista de usuarios obtenida con éxito",
      users,
    });
  } catch (error) {
    // En caso de error, responde con un mensaje de error
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error,
    });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      firstName,
      lastName,
      avatar,
      bio,
      specialties,
      hourlyRate,
      availability,
    } = req.body;

    // Actualizar los campos del perfil del usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        "profile.picture": avatar,
        "profile.bio": bio,
        "profile.specialties": specialties,
        "profile.hourlyRate": hourlyRate,
        availability,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

export const userById = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar usuario por ID
    const user = await User.findById(id);

    // Verificar si existe el usuario
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolver el usuario
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// Controlador para obtener usuarios con rol "advisor"
export const getAdvisors = async (req, res) => {
  try {
    // Obtener usuarios con rol "advisor"
    const advisors = await User.find({ role: "advisor" });

    if (!advisors || advisors.length === 0) {
      return res.status(404).json({ message: "No se encontraron asesores." });
    }

    // Devolver todos los datos de los asesores
    res.status(200).json(advisors);
  } catch (error) {
    console.error("Error al obtener asesores:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
