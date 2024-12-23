import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        sessionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session",
          required: true,
        },
        date: {
          type: String, // Fecha como string para simplicidad
          required: true,
        },
        time: {
          type: String, // Hora como string
          required: true,
        },
        duration: {
          type: Number, // Duración en minutos
          required: true,
        },
        rate: {
          type: Number, // Precio por hora
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.calculateTotalPrice = function () {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.quantity * item.session.price;
  }, 0);
  return this.totalPrice;
};

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
