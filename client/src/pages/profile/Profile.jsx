import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdvisorProfileEdit = () => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth(); // Obtener usuario actual desde el contexto de autenticación
  const [editingProfile, setEditingProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Estado para manejar la edición
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

  // Función para cargar los datos del perfil
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/id/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(response.data);
      setEditingProfile({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        avatar: response.data.profile?.picture || "",
        bio: response.data.profile?.bio || "",
        specialties: response.data.profile?.specialties || [],
        hourlyRate: response.data.profile?.hourlyRate || "",
        availability:
          response.data.profile?.availability || defaultAvailability,
      });
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      alert("Error al cargar el perfil.");
    }
  };

  // Cargar datos del perfil cuando el componente se monta
  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Eliminar especialidad
  const handleSpecialtyClick = (specialty) => {
    setEditingProfile((prev) => {
      const updatedSpecialties = prev.specialties.filter(
        (item) => item !== specialty
      );
      return { ...prev, specialties: updatedSpecialties };
    });
  };

  const addSpecialty = (e) => {
    const value = e.target.value;
    if (value && !editingProfile.specialties.includes(value)) {
      setEditingProfile((prev) => ({
        ...prev,
        specialties: [...prev.specialties, value],
      }));
    }
    e.target.value = "";
  };

  const handleAvailabilityChange = (day, timeslot) => {
    setEditingProfile((prev) => {
      const updatedAvailability = {
        ...(prev.availability || defaultAvailability),
      };
      updatedAvailability[day] = updatedAvailability[day] || [];
      if (updatedAvailability[day].includes(timeslot)) {
        updatedAvailability[day] = updatedAvailability[day].filter(
          (slot) => slot !== timeslot
        );
      } else {
        updatedAvailability[day] = [...updatedAvailability[day], timeslot];
      }
      return { ...prev, availability: updatedAvailability };
    });
  };

  const defaultAvailability = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  };

  const timeslots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Por favor, inicia sesión.");
        return;
      }

      // Verificar los datos antes de enviarlos
      console.log("Datos a enviar:", {
        firstName: editingProfile.firstName,
        lastName: editingProfile.lastName,
        avatar: editingProfile.avatar,
        bio: editingProfile.bio,
        specialties: editingProfile.specialties,
        hourlyRate: editingProfile.hourlyRate,
        availability: editingProfile.availability,
      });

      const response = await axios.put(
        `${apiUrl}/api/user/profile`,
        {
          firstName: editingProfile.firstName,
          lastName: editingProfile.lastName,
          avatar: editingProfile.avatar,
          bio: editingProfile.bio,
          specialties: editingProfile.specialties,
          hourlyRate: editingProfile.hourlyRate,
          availability: editingProfile.availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Datos actualizados:", response.data); // Agrega un log aquí
      setProfile(response.data); // Asegúrate de que estás actualizando el perfil
      alert("Perfil actualizado con éxito.");
      setIsEditing(false); // Volver a la vista de información

      // Llamar a fetchProfile para actualizar los datos del perfil
      fetchProfile();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Error al actualizar el perfil.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Activar el modo de edición
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Regresar a la vista de información
    setEditingProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.profile?.picture || "",
      bio: profile.profile?.bio || "",
      specialties: profile.profile?.specialties || [],
      hourlyRate: profile.profile?.hourlyRate || "",
    }); // Resetear a los datos actuales
  };

  if (!user) {
    return <p className="text-center text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Perfil de Asesor
      </h2>

      {!isEditing ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Información Actual
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <strong>Nombre:</strong>{" "}
                {profile?.firstName || "No especificado"}
              </p>
              <p className="text-gray-600">
                <strong>Apellido:</strong>{" "}
                {profile?.lastName || "No especificado"}
              </p>
              <p className="text-gray-600">
                <strong>Tarifa por hora:</strong> $
                {profile?.profile?.hourlyRate || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Biografía:</strong>{" "}
                {profile?.profile?.bio || "No especificado"}
              </p>
              <p className="text-gray-600">
                <strong>Especialidades:</strong>{" "}
                {profile?.profile?.specialties?.join(", ") || "No especificado"}
              </p>
            </div>
          </div>

          <button
            onClick={handleEditClick}
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
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
                <span
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleSpecialtyClick(specialty)}
                >
                  {specialty} (X)
                </span>
              </div>
            ))}
            <select
              onChange={addSpecialty}
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

          {/* Disponibilidad */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Disponibilidad
            </h3>
            {Object.keys(defaultAvailability).map((day) => (
              <div key={day} className="mb-4">
                <h4 className="font-medium text-gray-600 mb-2 capitalize">
                  {day}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {timeslots.map((timeslot) => (
                    <button
                      key={timeslot}
                      type="button"
                      onClick={() => handleAvailabilityChange(day, timeslot)}
                      className={`px-4 py-2 border rounded-lg text-sm ${
                        (editingProfile.availability?.[day] || []).includes(
                          timeslot
                        )
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {timeslot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancelClick}
              className="w-full py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdvisorProfileEdit;
