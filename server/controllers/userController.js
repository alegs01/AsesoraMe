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
      console.log(existingUser);
      return res.status(400).json({ message: "Email already in use" });
    }

    // Encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea el objeto con los datos del nuevo usuario
    const newUserData = new User({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
    });

    // Crea y guarda el nuevo usuario en la base de datos
    const newUser = await newUserData.save();
    console.log(newUserData);
    // Responde con éxito al cliente
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    // En caso de error, responde con un mensaje de error
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token: token, user: user });
  } catch (error) {
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
    specialities,
    hourlyRate,
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
    if (specialities) updateData.profile.specialities = specialities;
    if (hourlyRate) updateData.profile.hourlyRate = hourlyRate;

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
