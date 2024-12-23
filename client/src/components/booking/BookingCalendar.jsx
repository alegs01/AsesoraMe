import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart"; // Importa el hook de carrito
import { useNavigate } from "react-router-dom";

export default function BookingCalendar({ advisor }) {
  const { user } = useAuth(); // Solo para autenticación
  const { addToCart } = useCart(); // Para operaciones del carrito
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(new Date()), i)
  );

  const handleBooking = async () => {
    console.log("handleBooking ejecutado");
    if (isProcessing) return; // Evita ejecuciones múltiples
    setIsProcessing(true);

    if (!user) {
      navigate("/login"); // Redirigir al inicio de sesión si no está autenticado
      setIsProcessing(false);
      return;
    }

    const sessionData = {
      advisorId: advisor.id, // ID del asesor
      clientId: user._id, // ID del cliente (autenticado)
      date: selectedDate.toISOString().split("T")[0], // Solo la fecha en formato "YYYY-MM-DD"
      time: selectedTime, // Hora seleccionada
      duration: 60, // Duración predeterminada de 1 hora
      rate: advisor.hourlyRate, // Información del costo
    };

    try {
      // Llama directamente al endpoint `addToCart` para que el backend maneje la lógica de creación
      await addToCart(sessionData);
      alert("Reserva añadida al carrito.");
    } catch (error) {
      console.error(
        "Error al agregar la reserva al carrito:",
        error.response?.data || error
      );
      alert("Hubo un problema al agregar la reserva al carrito.");
    } finally {
      setIsProcessing(false); // Rehabilitar el botón
    }
  };

  return (
    <div className="space-y-4">
      {/* Selección de fecha */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`p-2 text-center text-sm rounded-md ${
              format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{format(date, "EEE")}</div>
            <div>{format(date, "d")}</div>
          </button>
        ))}
      </div>

      {/* Horarios disponibles */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">
          Horarios Disponibles
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {advisor.availability[
            format(selectedDate, "EEEE").toLowerCase()
          ]?.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 text-sm rounded-md ${
                selectedTime === time
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen de la reserva */}
      {selectedTime && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700">
            Resumen de la Reserva
          </h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-600">
              Fecha: {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <p className="text-sm text-gray-600">Hora: {selectedTime}</p>
            <p className="text-sm text-gray-600">Duración: 1 hora</p>
            <p className="text-sm font-medium text-gray-900">
              Total: ${advisor.hourlyRate}
            </p>
          </div>
          <button
            onClick={handleBooking}
            disabled={isProcessing}
            className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-medium ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isProcessing ? "Procesando..." : "Confirmar Reserva"}
          </button>
        </div>
      )}
    </div>
  );
}
