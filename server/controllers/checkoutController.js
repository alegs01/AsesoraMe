import Session from "../models/sessionModel.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const createSession = async (req, res) => {
  const { advisorId, startTime, duration, paymentAmount, notes } = req.body;

  const clientId = req.user?.id; // Obtén el ID del cliente autenticado

  if (!clientId || !advisorId || !startTime || !duration || !paymentAmount) {
    return res
      .status(400)
      .json({ message: "Datos insuficientes para crear la sesión" });
  }

  try {
    // Crear una nueva sesión
    const newSession = await Session.create({
      advisor: advisorId,
      client: clientId,
      startTime: new Date(startTime),
      duration,
      payment: {
        amount: paymentAmount,
        status: "pending",
      },
      notes,
    });

    res.status(201).json({
      message: "Sesión creada exitosamente",
      session: newSession,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la sesión", error });
  }
};

export const getUserSessions = async (req, res) => {
  const userId = req.user?.id;

  try {
    // Buscar sesiones asociadas al usuario (como cliente o asesor)
    const sessions = await Session.find({
      $or: [{ client: userId }, { advisor: userId }],
    }).populate("advisor client");

    res.status(200).json({ sessions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las sesiones del usuario", error });
  }
};

export const updateSessionStatus = async (req, res) => {
  const { sessionId, status } = req.body;

  if (!sessionId || !status) {
    return res
      .status(400)
      .json({ message: "Datos insuficientes para actualizar la sesión" });
  }

  try {
    // Validar el estado
    if (!["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    // Actualizar el estado de la sesión
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    res.status(200).json({
      message: "Estado de la sesión actualizado",
      session: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la sesión", error });
  }
};

export const createPaymentLink = async (req, res) => {
  const { sessionId, email } = req.body;

  if (!sessionId || !email) {
    return res
      .status(400)
      .json({ message: "Datos insuficientes para crear el enlace de pago" });
  }

  try {
    // Obtener la sesión para verificar el monto del pago
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    const preference = {
      items: [
        {
          title: "Pago por sesión de asesoría",
          quantity: 1,
          unit_price: session.payment.amount,
        },
      ],
      payer: {
        email,
      },
      back_urls: {
        success: "https://www.tu-plataforma.com/success",
        failure: "https://www.tu-plataforma.com/failure",
        pending: "https://www.tu-plataforma.com/pending",
      },
      auto_return: "approved",
    };

    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer APP_USR-1103948530982831-112217-bef9ec8c4c9ae00a98e3fd97a3c92df7-221707668`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      init_point: response.data.init_point,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el enlace de pago", error });
  }
};
