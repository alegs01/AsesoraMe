import { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function BookingCalendar({ advisor }) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(new Date()), i)
  );

  const handleBooking = async () => {
    if (!user) {
      // Redirigir al inicio de sesión
      return;
    }

    const bookingData = {
      advisorId: advisor.id,
      clientId: user.id,
      date: selectedDate,
      time: selectedTime,
      duration: 60, // Duración predeterminada de 1 hora
      rate: advisor.hourlyRate
    };

    // Aquí se haría una llamada a la API para crear la reserva
    console.log('Reserva creada:', bookingData);
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
              format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="font-medium">{format(date, 'EEE')}</div>
            <div>{format(date, 'd')}</div>
          </button>
        ))}
      </div>

      {/* Horarios disponibles */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Horarios Disponibles</h3>
        <div className="grid grid-cols-2 gap-2">
          {advisor.availability[format(selectedDate, 'EEEE').toLowerCase()]?.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 text-sm rounded-md ${
                selectedTime === time
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
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
          <h3 className="text-sm font-medium text-gray-700">Resumen de la Reserva</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-600">
              Fecha: {format(selectedDate, 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-600">Hora: {selectedTime}</p>
            <p className="text-sm text-gray-600">
              Duración: 1 hora
            </p>
            <p className="text-sm font-medium text-gray-900">
              Total: ${advisor.hourlyRate}
            </p>
          </div>
          <button
            onClick={handleBooking}
            className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Confirmar Reserva
          </button>
        </div>
      )}
    </div>
  );
}
