import { Cart } from "../models/cartModel.js";
import { User } from "../models/userModel.js";
import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

/* const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-1103948530982831-112217-bef9ec8c4c9ae00a98e3fd97a3c92df7-221707668",
});

const preferences = new Preference(client); */

// Función para crear una sesión de checkout de prueba
export const createCheckoutSession = async (req, res) => {
  // Obtiene el ID del usuario de la solicitud
  const userID = req.user.id;

  // Encuentra al usuario en la base de datos por su ID
  const foundUser = await User.findOne({ _id: userID });

  // Encuentra el carrito del usuario en la base de datos y llena los productos
  const foundCart = await Cart.findById(foundUser.cart).populate({
    path: "products",
  });

  // Crea line_items simulados para el proceso de pago
  const line_items = foundCart.products.map((e) => {
    return {
      name: e.name,
      quantity: e.quantity,
      price: e.price,
    };
  });

  // Respuesta simulada
  res.json({
    message: "Sesión de checkout simulada creada.",
    line_items,
  });
};

export const createOrder = async (req, res) => {
  const { email, items } = req.body;

  // Validar datos de entrada
  if (!email || !items || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Datos insuficientes para crear la orden" });
  }

  try {
    // Crear el body de la solicitud
    const preference = {
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      payer: {
        email,
      },
      back_urls: {
        success: "https://www.tu-tienda.com/success",
        failure: "https://www.tu-tienda.com/failure",
        pending: "https://www.tu-tienda.com/pending",
      },
      auto_return: "approved",
    };

    console.log(
      "Datos enviados a Mercado Pago:",
      JSON.stringify(preference, null, 2)
    );

    // Realizar el POST a la API de Mercado Pago
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

    // Devolver el enlace de pago
    res.status(200).json({
      init_point: response.data.init_point,
    });
  } catch (error) {
    console.error(
      "Error al crear la preferencia:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error al crear la preferencia",
      error: error.response?.data || error.message,
    });
  }
};

// Función para crear un carrito
export const createCart = async (req, res) => {
  const { products } = req.body;

  // Obtener el ID del usuario desde `req.user`
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "No se encontró el usuario autenticado" });
  }

  try {
    // Crea un nuevo carrito
    const newCart = await Cart.create({ products });

    // Encuentra al usuario y vincula el carrito
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart: newCart._id },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(201).json({
      message: "Carrito creado y asociado al usuario",
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error });
  }
};

export const getUserCart = async (req, res) => {
  const { email } = req.query;

  try {
    const foundUser = await User.findOne({ email }).populate("cart");

    if (!foundUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!foundUser.cart) {
      return res
        .status(404)
        .json({ message: "El usuario no tiene un carrito asociado" });
    }

    res.status(200).json({
      cart: foundUser.cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el carrito del usuario", error });
  }
};

// Función para obtener un carrito
export const getCart = async (req, res) => {
  // Obtiene el ID del usuario de la solicitud
  const userID = req.user.id;

  // Encuentra al usuario en la base de datos por su ID
  const foundUser = await User.findOne({ _id: userID });

  // Encuentra el carrito del usuario en la base de datos
  const foundCart = await Cart.findOne({ _id: foundUser.cart });

  // Envía el carrito encontrado en la respuesta
  res.json({
    cart: foundCart,
  });
};

// Función para editar un carrito
export const editCart = async (req, res) => {
  // Obtiene el ID del usuario de la solicitud
  const userID = req.user.id;

  // Encuentra al usuario en la base de datos por su ID
  const foundUser = await User.findOne({ _id: userID });

  // Toma los nuevos datos de los productos de la solicitud
  const { products } = req.body;

  // Actualiza el carrito con los nuevos datos de los productos
  const updatedCart = await Cart.findByIdAndUpdate(
    foundUser.cart,
    {
      products,
    },
    { new: true }
  );

  // Envía un mensaje y el carrito actualizado en la respuesta
  res.json({
    msg: "Tu carrito fue actualizado",
    updatedCart,
  });
};
