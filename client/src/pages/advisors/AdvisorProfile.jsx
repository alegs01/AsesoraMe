import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";
import BookingCalendar from "../../components/booking/BookingCalendar";
import ReviewList from "../../components/reviews/ReviewList";
import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export default function AdvisorProfile() {
  const { id } = useParams(); // Obtener el ID del asesor desde la URL
  const [advisor, setAdvisor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchAdvisor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/id/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;

        // Mapeamos los datos para adaptarlos a lo que necesita el componente
        setAdvisor({
          id: data._id,
          name: `${data.firstName} ${data.lastName}`,
          avatar: data.profile.picture,
          bio: data.profile.bio,
          specialties: data.profile.specialties,
          rating: data.profile.rating,
          reviewCount: data.profile.reviewCount,
          hourlyRate: data.profile.hourlyRate,
          availability: data.availability,
        });
      } catch (error) {
        console.error("Error al obtener el asesor:", error);
      }
    };

    fetchAdvisor();
  }, [id]);

  if (!advisor) {
    return <p className="text-center text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <img
                src={advisor.avatar}
                alt={advisor.name}
                className="h-24 w-24 rounded-full"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {advisor.name}
                </h1>
                <div className="flex items-center mt-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">
                    {advisor.rating} ({advisor.reviewCount} reseñas)
                  </span>
                </div>
                <div className="mt-2">
                  {advisor.specialties?.map((specialty, index) => (
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
              <p className="mt-2 text-gray-600">{advisor.bio}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Tarifa</h2>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${advisor.hourlyRate}/hora
              </p>
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

          <div className="mt-8">
            <ReviewList advisorId={id} />
          </div>
        </div>

        <div className="md:col-span-1">
          {showBooking && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Programar una sesión
              </h2>
              <BookingCalendar advisor={advisor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
