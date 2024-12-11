import Session from "../models/sessionModel.js";

// Función para crear una nueva sesión
export const createSession = async (req, res) => {
  try {
    // Desestructuración de los datos recibidos en el cuerpo de la solicitud
    const { advisor, client, startTime, duration, payment, notes } = req.body;

    // Crea una nueva sesión en la base de datos con los datos proporcionados
    const session = await Session.create({
      advisor,
      client,
      startTime,
      duration,
      payment,
      notes,
    });

    // Respuesta exitosa con la sesión creada
    res.status(201).json({
      message: "Sesión creada con éxito",
      session,
    });
  } catch (error) {
    // Si ocurre un error, se retorna un mensaje con el error
    res.status(400).json({ message: "Error al crear la sesión", error });
  }
};

// Función para obtener todas las sesiones
export const getAllSessions = async (req, res) => {
  try {
    // Busca todas las sesiones en la base de datos y pobla las referencias de los usuarios (asesores y clientes)
    const sessions = await Session.find()
      .populate("advisor", "firstName lastName email") // Pobla la referencia del asesor
      .populate("client", "firstName lastName email"); // Pobla la referencia del cliente

    // Respuesta exitosa con la lista de sesiones obtenida
    res.status(200).json({
      message: "Lista de sesiones obtenida con éxito",
      sessions,
    });
  } catch (error) {
    // Si ocurre un error al obtener las sesiones, se retorna un mensaje de error
    res.status(500).json({
      message: "Error al obtener las sesiones",
      error,
    });
  }
};

// Función para obtener una sesión específica por su ID
export const getSession = async (req, res) => {
  try {
    // Extrae el ID de la sesión desde los parámetros de la URL
    const { id } = req.params;

    // Busca la sesión por su ID y pobla las referencias de los usuarios (asesores y clientes)
    const session = await Session.findById(id)
      .populate("advisor", "firstName lastName email")
      .populate("client", "firstName lastName email");

    // Si la sesión no existe, se devuelve un error
    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    // Respuesta exitosa con la sesión encontrada
    res.status(200).json({
      message: "Sesión encontrada con éxito",
      session,
    });
  } catch (error) {
    // Si ocurre un error al obtener la sesión, se retorna un mensaje de error
    res.status(500).json({
      message: "Error al obtener la sesión",
      error,
    });
  }
};

// Función para actualizar una sesión existente
export const updateSession = async (req, res) => {
  // Extrae el ID de la sesión desde los parámetros de la URL
  const { id } = req.params;

  // Desestructura los datos recibidos en el cuerpo de la solicitud
  const { startTime, duration, status, payment, notes, rating } = req.body;

  try {
    // Prepara los datos de actualización
    const updateData = {};

    if (startTime) updateData.startTime = startTime;
    if (duration) updateData.duration = duration;
    if (status) updateData.status = status;
    if (payment) updateData.payment = payment;
    if (notes) updateData.notes = notes;
    if (rating) updateData.rating = rating;

    // Actualiza la sesión con los nuevos datos
    const updatedSession = await Session.findByIdAndUpdate(id, updateData, {
      new: true, // Retorna la sesión actualizada
      runValidators: true, // Aplica validaciones al actualizar
    });

    // Si no se encuentra la sesión, se retorna un error
    if (!updatedSession) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    // Respuesta exitosa con la sesión actualizada
    res.status(200).json({
      message: "Sesión actualizada con éxito",
      session: updatedSession,
    });
  } catch (error) {
    // Si ocurre un error al actualizar la sesión, se retorna un mensaje de error
    res.status(400).json({
      message: "Error al actualizar la sesión",
      error,
    });
  }
};

// Función para eliminar una sesión
export const deleteSession = async (req, res) => {
  try {
    // Extrae el ID de la sesión desde los parámetros de la URL
    const { id } = req.params;

    // Elimina la sesión con el ID proporcionado
    const deletedSession = await Session.findByIdAndDelete(id);

    // Si no se encuentra la sesión, se retorna un error
    if (!deletedSession) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    // Respuesta exitosa con la sesión eliminada
    res.status(200).json({
      message: "Sesión eliminada con éxito",
      deletedSession,
    });
  } catch (error) {
    // Si ocurre un error al eliminar la sesión, se retorna un mensaje de error
    res.status(500).json({
      message: "Error al eliminar la sesión",
      error: error.message,
    });
  }
};
