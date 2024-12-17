import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Encuentra Asesores Expertos
          <span className="text-indigo-600"> Bajo Demanda</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Conéctate con asesores profesionales en diversas áreas. Obtén orientación personalizada y consulta experta cuando la necesites.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          {!user ? (
            <>
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Comienza Ahora
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-md shadow">
              <Link
                to="/advisors"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Ver Asesores
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Cómo Funciona</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Obtén Asesoría Experta en Tres Simples Pasos
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    1
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Ver Asesores</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Encuentra el asesor perfecto según su experiencia, calificaciones y disponibilidad.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    2
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Reservar una Sesión</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Agenda una consulta en un horario que te convenga.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    3
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Recibir Asesoría Experta</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Conéctate con tu asesor y recibe orientación personalizada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
