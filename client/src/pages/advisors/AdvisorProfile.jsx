import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import BookingCalendar from '../../components/booking/BookingCalendar';
import ReviewList from '../../components/reviews/ReviewList';

// Esto normalmente vendría de una API
const MOCK_ADVISOR = {
  id: 1,
  name: 'Carlos López',
  specialties: ['Planificación Financiera', 'Inversiones'],
  rating: 4.8,
  reviewCount: 124,
  hourlyRate: 25.000,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  bio: 'Asesor financiero certificado con más de 10 años de experiencia en gestión de inversiones y planificación para el retiro.',
  availability: {
    monday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    thursday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    friday: ['09:00', '10:00', '11:00', '14:00', '15:00']
  }
};

export default function AdvisorProfile() {
  const { id } = useParams();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Información del asesor */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <img
                src={MOCK_ADVISOR.avatar}
                alt={MOCK_ADVISOR.name}
                className="h-24 w-24 rounded-full"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{MOCK_ADVISOR.name}</h1>
                <div className="flex items-center mt-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">
                    {MOCK_ADVISOR.rating} ({MOCK_ADVISOR.reviewCount} reseñas)
                  </span>
                </div>
                <div className="mt-2">
                  {MOCK_ADVISOR.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
              <p className="mt-2 text-gray-600">{MOCK_ADVISOR.bio}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Tarifa</h2>
              <p className="mt-2 text-2xl font-bold text-gray-900">${MOCK_ADVISOR.hourlyRate}/hora</p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowBooking(!showBooking)}
                className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reservar una sesión
              </button>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="mt-8">
            <ReviewList advisorId={id} />
          </div>
        </div>

        {/* Calendario de reservas */}
        <div className="md:col-span-1">
          {showBooking && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Programar una sesión</h2>
              <BookingCalendar advisor={MOCK_ADVISOR} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
