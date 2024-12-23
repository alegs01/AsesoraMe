export default function AdvisorFilter({ filters, setFilters }) {
  const specialties = [
    "Programación",
    "Planificación Financiera",
    "Inversiones",
    "Desarrollo Profesional",
    "Liderazgo",
    "Estrategia Empresarial",
    "Marketing",
    "Asesoría Legal",
  ];

  const priceRanges = [
    { label: "Menos de $50/hora", value: "0-50" },
    { label: "$50-100/hora", value: "50-100" },
    { label: "$100-200/hora", value: "100-200" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Especialidad
          </label>
          <select
            value={filters.specialty}
            onChange={(e) =>
              setFilters({ ...filters, specialty: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Todas las Especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rango de Precios
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) =>
              setFilters({ ...filters, priceRange: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Cualquier Precio</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Calificación Mínima
          </label>
          <select
            value={filters.rating}
            onChange={(e) =>
              setFilters({ ...filters, rating: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="0">Cualquier Calificación</option>
            <option value="4">4+ Estrellas</option>
            <option value="4.5">4.5+ Estrellas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
