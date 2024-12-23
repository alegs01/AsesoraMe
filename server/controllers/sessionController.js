import Session from "../models/sessionModel.js";
import { Cart } from "../models/cartModel.js";

// Crear una nueva sesión
export const createSession = async (req, res) => {
  console.log("Creando sesión...");
  try {
    const { advisor, client, date, time, duration, payment, notes, price } =
      req.body;

    // Validar campos obligatorios
    if (!advisor || !client || !date || !time || !duration) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Crear la sesión
    const session = await Session.create({
      advisor,
      client,
      date,
      time,
      duration,
      payment,
      notes,
      price,
    });

    res.status(201).json({
      message: "Sesión creada con éxito",
      session,
    });
  } catch (error) {
    res.status(400).json({ message: "Error al crear la sesión", error });
  }
};

// Obtener todas las sesiones
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("advisor", "firstName lastName email")
      .populate("client", "firstName lastName email");

    res.status(200).json({
      message: "Lista de sesiones obtenida con éxito",
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las sesiones",
      error,
    });
  }
};

// Obtener una sesión específica por su ID
export const getSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("advisor", "firstName lastName email")
      .populate("client", "firstName lastName email");

    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    res.status(200).json({
      message: "Sesión encontrada con éxito",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la sesión",
      error,
    });
  }
};

// Actualizar una sesión existente
export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { date, time, duration, status, payment, notes, rating, price } =
    req.body;

  try {
    const updateData = {};

    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (duration) updateData.duration = duration;
    if (status) updateData.status = status;
    if (payment) updateData.payment = payment;
    if (notes) updateData.notes = notes;
    if (rating) updateData.rating = rating;
    if (price) updateData.price = price;

    const updatedSession = await Session.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSession) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    res.status(200).json({
      message: "Sesión actualizada con éxito",
      session: updatedSession,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar la sesión",
      error,
    });
  }
};

// Eliminar una sesión
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params; // ID de la sesión a eliminar

    // Elimina la sesión del modelo Session
    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    // Vaciar el carrito asociado al cliente de la sesión eliminada
    await Cart.findOneAndUpdate(
      { user: deletedSession.client },
      { items: [], totalPrice: 0 }
    );

    res.status(200).json({
      message: "Sesión eliminada y carrito vaciado",
    });
  } catch (error) {
    console.error("Error al eliminar la sesión:", error);
    res.status(500).json({
      message: "Error al eliminar la sesión y vaciar el carrito",
      error: error.message,
    });
  }
};
