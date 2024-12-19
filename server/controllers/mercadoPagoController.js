import { Preference } from "mercadopago";
import client from "../config/mercadopago.config.js";

export const createPreference = async (req, res, next) => {
  try {
    const { cart } = req.body;

    //Vamos a estructura los datos de los productos del carrito - Debe ser idealmente un Array
    const items = cart.map((product) => ({
      title: product.nombre,
      unit_price: Number(product.precio),
      quantity: Number(product.quantity),
      currency_id: "CLP",
    }));

    //Es el cuerpo de configuración de las preferencias de compra para MercadoPago
    const body = {
      items, //Debe tener un campo Item que sea un arreglo
      back_urls: {
        success: "http://localhost:3001/mercadopago/status?status=approved",
        failure: "http://localhost:3001/mercadopago/status?status=failure",
        pending: "http://localhost:3001/mercadopago/status?status=pending",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const response = await preference.create({ body });

    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
