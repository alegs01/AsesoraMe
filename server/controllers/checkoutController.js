import Session from "../models/sessionModel.js";
import { Cart } from "../models/cartModel.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Agregar una sesión al carrito
export const addToCart = async (req, res) => {
  const { advisorId, clientId, date, time, duration, rate } = req.body;

  // Validar datos necesarios
  if (!advisorId || !clientId || !date || !time || !duration || !rate) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // Buscar o crear un carrito para el usuario
    let cart = await Cart.findOne({ user: clientId });

    if (!cart) {
      cart = await Cart.create({ user: clientId, items: [], totalPrice: 0 });
    }

    // Verificar si ya existe una entrada similar en el carrito
    const isSessionInCart = cart.items.some(
      (item) =>
        item.date === date &&
        item.time === time &&
        item.sessionId.toString() === advisorId
    );

    if (isSessionInCart) {
      return res
        .status(400)
        .json({ message: "La sesión ya está en el carrito" });
    }

    // Agregar la nueva entrada al carrito
    cart.items.push({
      sessionId: advisorId,
      date,
      time,
      duration,
      rate,
      quantity: 1,
    });

    // Recalcular el precio total
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.rate,
      0
    );

    await cart.save();

    res.status(200).json({
      message: "Reserva añadida al carrito",
      cart,
    });
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res
      .status(500)
      .json({ message: "Error al agregar la sesión al carrito", error });
  }
};

// Obtener el carrito del usuario
export const getCart = async (req, res) => {
  const userId = req.user?.id;

  try {
    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.sessionId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error });
  }
};

// Eliminar una sesión del carrito
export const removeFromCart = async (req, res) => {
  const sessionId = req.body.sessionId || req.params.id;

  console.log("Request received to remove from cart");
  console.log("UserId:", userId); // Verificar que userId se esté configurando correctamente
  console.log("SessionId:", sessionId); // Verificar que sessionId se recibe correctamente

  try {
    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Filtrar para eliminar la sesión del carrito
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.sessionId.toString() !== sessionId
    );

    if (cart.items.length === initialItemCount) {
      return res
        .status(404)
        .json({ message: "La sesión no se encuentra en el carrito" });
    }

    // Recalcular el precio total
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.rate,
      0
    );

    await cart.save();

    res.status(200).json({ message: "Sesión eliminada del carrito", cart });
  } catch (error) {
    console.error("Error al eliminar la sesión del carrito:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar la sesión del carrito", error });
  }
};

// Crear un enlace de pago basado en el carrito
export const createCartPaymentLink = async (req, res) => {
  const userId = req.user?.id;

  try {
    // Buscar el carrito del usuario y popular las sesiones asociadas
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.sessionId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Construir la preferencia de pago
    const preference = {
      items: cart.items.map((item) => ({
        title: `Sesión con ${item.sessionId.advisor.firstName} ${item.sessionId.advisor.lastName}`,
        quantity: item.quantity,
        unit_price: item.sessionId.payment.amount, // Asegúrate de usar el precio correcto
        currency_id: "CLP",
      })),
      payer: {
        email: req.user?.email || "cliente@ejemplo.com", // Asegúrate de manejar correos no definidos
      },
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      auto_return: "approved",
    };

    // Crear la preferencia de pago en Mercado Pago
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Responder con el enlace de pago
    res.status(200).json({
      init_point: response.data.init_point,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el enlace de pago",
      error: error.response?.data || error.message,
    });
  }
};
