import { useState, useEffect } from "react";
import AdvisorCard from "../../components/advisors/AdvisorCard";
import AdvisorFilter from "../../components/advisors/AdvisorFilter";
import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

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
        const apiResponse = await axios.get(`${apiUrl}/api/user/advisors`);

        const apiAdvisors =
          apiResponse?.data && Array.isArray(apiResponse.data)
            ? apiResponse.data.map((advisor) => ({
                id: advisor._id, // MongoDB _id mapeado a id
                name: `${advisor.firstName} ${advisor.lastName}`,
                specialties: advisor.profile.specialties,
                rating: advisor.profile.rating,
                reviewCount: advisor.profile.reviewCount,
                hourlyRate: advisor.profile.hourlyRate,
                avatar: advisor.profile.picture,
                bio: advisor.profile.bio,
              }))
            : [];

        setAdvisors(apiAdvisors);
      } catch (error) {
        console.error("Error al obtener los asesores: ", error);
      }
    };

    fetchAdvisors();
  }, []);

  // Lógica de filtrado
  const filteredAdvisors = advisors.filter((advisor) => {
    // Filtrar por especialidad
    if (filters.specialty && !advisor.specialties.includes(filters.specialty)) {
      return false;
    }

    // Filtrar por rango de precios
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split("-").map(Number);
      const advisorPrice = advisor.hourlyRate;
      if (
        (minPrice && advisorPrice < minPrice) ||
        (maxPrice && advisorPrice > maxPrice)
      ) {
        return false;
      }
    }

    // Filtrar por calificación mínima
    if (filters.rating && advisor.rating < filters.rating) {
      return false;
    }

    return true;
  });

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
            {filteredAdvisors.length > 0 ? (
              filteredAdvisors.map((advisor) => (
                <AdvisorCard key={advisor.id} advisor={advisor} />
              ))
            ) : (
              <p className="text-gray-500">No se encontraron asesores.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
