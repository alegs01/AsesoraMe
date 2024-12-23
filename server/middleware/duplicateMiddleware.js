import { Cart } from "../models/cartModel.js";

export const preventDuplicateSessions = async (req, res, next) => {
  const { clientId, date, time } = req.body;

  const existingCart = await Cart.findOne({
    user: clientId,
    "items.date": date,
    "items.time": time,
  });

  if (existingCart) {
    return res
      .status(400)
      .json({ message: "La sesión ya está en el carrito." });
  }

  next();
};
