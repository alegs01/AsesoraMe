import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";

export default function Cart() {
  const { authStatus } = useAuth();
  const { cart, fetchCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStatus) {
      alert("Debes iniciar sesión para ver tu carrito.");
      navigate("/login");
    }
  }, [authStatus, navigate]);

  useEffect(() => {
    if (authStatus && fetchCart) {
      fetchCart();
    }
  }, [authStatus, fetchCart]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/checkout/payment-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token para autenticar
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el enlace de pago");
      }

      const data = await response.json();
      console.log("Enlace de pago generado:", data.init_point);

      // Abrir el enlace de pago en una nueva pestaña
      window.open(data.init_point, "_blank");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un problema al generar el enlace de pago.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Carrito de Compras
        </h1>

        <div className="space-y-4">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={item._id || `${item.sessionId}-${index}`}
                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Reserva con ID: {item.sessionId?._id || "No disponible"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fecha: {item.sessionId?.date || "No disponible"} - Hora:{" "}
                    {item.sessionId?.time || "No disponible"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duración: {item.sessionId?.duration || "No disponible"}{" "}
                    minutos
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Precio: ${item.rate}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.sessionId._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">El carrito está vacío.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCheckout}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}
