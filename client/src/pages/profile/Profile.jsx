import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdvisorProfileEdit = () => {
  const [profile, setProfile] = useState(null);
  const { user, setUser } = useAuth();
  const [editingProfile, setEditingProfile] = useState({});

  const specialtiesOptions = [
    "Programación",
    "Planificación Financiera",
    "Inversiones",
    "Desarrollo Profesional",
    "Liderazgo",
    "Estrategia Empresarial",
    "Marketing",
    "Asesoría Legal",
  ];

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    console.log(user);
    if (user == null) {
      console.log("nadaa");
    }
  }, []);
  /*   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/profile`);
        setProfile(response.data);
        setEditingProfile({
          ...response.data,
          specialties: response.data.specialties || [], // Aseguramos que specialties sea un arreglo
        });
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    fetchProfile();
  }, []); */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtiesChange = (index, value) => {
    setEditingProfile((prev) => {
      const updatedSpecialties = prev.specialties ? [...prev.specialties] : [];
      updatedSpecialties[index] = value;
      return { ...prev, specialties: updatedSpecialties };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/api/auth/profile`,
        editingProfile
      );
      setProfile(response.data);
      alert("Perfil actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Error al actualizar el perfil.");
    }
  };

  if (user == null) {
    return <p className="text-center text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Editar Perfil de Asesor {user.email}
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Información Actual
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <strong>Nombre:</strong>
            </p>
            <p className="text-gray-600">
              <strong>Apellido:</strong>
            </p>
            <p className="text-gray-600">
              <strong>Tarifa por hora:</strong> $
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Biografía:</strong>
            </p>
            <p className="text-gray-600">
              <strong>Especialidades:</strong>{" "}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Editar Información
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-2">Nombre:</label>
            <input
              type="text"
              name="firstName"
              value={editingProfile.firstName || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Apellido:</label>
            <input
              type="text"
              name="lastName"
              value={editingProfile.lastName || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Avatar (URL):</label>
          <input
            type="text"
            name="avatar"
            value={editingProfile.avatar || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Biografía:</label>
          <textarea
            name="bio"
            value={editingProfile.bio || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Tarifa por hora:</label>
          <input
            type="number"
            name="hourlyRate"
            value={editingProfile.hourlyRate || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Especialidades:</label>
          {editingProfile.specialties?.map((specialty, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={specialty}
                onChange={(e) => handleSpecialtiesChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
          ))}
          <select
            onChange={handleSpecialtiesChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          >
            <option value="">Selecciona una especialidad</option>
            {specialtiesOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default AdvisorProfileEdit;
