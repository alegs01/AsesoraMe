import { useState, useEffect } from "react";
import AdvisorCard from "../../components/advisors/AdvisorCard";
import AdvisorFilter from "../../components/advisors/AdvisorFilter";
import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

/* const MOCK_ADVISORS = [
  {
    id: 1,
    name: "Carlos López",
    specialties: ["Planificación Financiera", "Inversiones"],
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 25.0,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Asesor financiero certificado con más de 10 años de experiencia en gestión de inversiones y planificación para el retiro.",
  },
  {
    id: 2,
    name: "María Fernández",
    specialties: ["Desarrollo Profesional", "Liderazgo"],
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 50.0,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Coach ejecutiva especializada en transiciones de carrera y desarrollo de liderazgo.",
  },
]; */

export default function AdvisorList() {
  const [advisors, setAdvisors] = useState([]);
  const [filters, setFilters] = useState({
    specialty: "",
    priceRange: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const apiResponse = await axios.get(`${apiUrl}/api/user/advisors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("API Response: ", apiResponse); // Ver respuesta de la API

        const apiAdvisors =
          apiResponse?.data && Array.isArray(apiResponse.data)
            ? apiResponse.data.map((advisor) => ({
                id: advisor._id, // MongoDB _id mapeado a id
                name: `${advisor.firstName} ${advisor.lastName}`,
                specialties: advisor.profile.specialties,
                rating: advisor.profile.rating,
                reviewCount: advisor.profile.reviewCount,
                hourlyRate: advisor.profile.hourlyRate,
                avatar: advisor.profile.avatar || "default-avatar-url", // Añadir avatar por defecto
                bio: advisor.profile.bio,
              }))
            : [];

        setAdvisors(apiAdvisors);
        console.log("Advisors state after setAdvisors: ", apiAdvisors); // Ver estado después de actualizar
      } catch (error) {
        console.error("Error al obtener los asesores: ", error);
      }
    };

    fetchAdvisors();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Filtrar los asesores en función de los filtros aplicados
  const filteredAdvisors = advisors.filter((advisor) => {
    if (Array.isArray(advisor.specialties)) {
      const matchesSpecialty = advisor.specialties.some((specialty) =>
        specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
      return matchesSpecialty;
    }
    return false;
  });

  console.log("Filtered Advisors: ", filteredAdvisors); // Ver los asesores filtrados

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <AdvisorFilter filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Asesores Disponibles
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAdvisors.map((advisor) => {
              console.log("Rendering advisor: ", advisor); // Ver cada asesor renderizado
              return <AdvisorCard key={advisor.id} advisor={advisor} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
