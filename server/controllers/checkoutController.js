import Session from "../models/sessionModel.js";
import { Cart } from "../models/cartModel.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Agregar una sesión al carrito
export const addToCart = async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user?.id;

  if (!sessionId) {
    return res.status(400).json({ message: "Falta el ID de la sesión" });
  }

  try {
    // Buscar la sesión para asegurarse de que existe
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }

    // Verificar que la sesión tenga un precio válido en payment.amount
    const price = session.payment?.amount;
    if (!price || typeof price !== "number") {
      return res
        .status(400)
        .json({ message: "La sesión no tiene un precio válido" });
    }

    // Buscar o crear un carrito para el usuario
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Verificar si la sesión ya está en el carrito
    const isSessionInCart = cart.items.some(
      (item) => item.sessionId.toString() === sessionId
    );

    if (isSessionInCart) {
      return res
        .status(400)
        .json({ message: "La sesión ya está en el carrito" });
    }

    // Agregar la sesión al carrito
    cart.items.push({
      sessionId: session._id,
      quantity: 1,
    });

    // Recalcular el precio total
    cart.totalPrice = cart.items.reduce((total, item) => {
      const itemSession =
        item.sessionId.toString() === session._id.toString() ? price : 0;
      return total + item.quantity * itemSession;
    }, 0);

    await cart.save();

    res.status(200).json({
      message: "Sesión agregada al carrito",
      cart,
    });
  } catch (error) {
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
    const cart = await Cart.findOne({ user: userId }).populate("items.session");

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
  const { sessionId } = req.body;
  const userId = req.user?.id;

  try {
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
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * (item.session?.payment?.amount || 0);
    }, 0);

    await cart.save();

    res.status(200).json({ message: "Sesión eliminada del carrito", cart });
  } catch (error) {
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
