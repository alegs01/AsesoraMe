import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';

export default function AdvisorCard({ advisor }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full"
            src={advisor.avatar}
            alt={advisor.name}
          />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{advisor.name}</h3>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">
                {advisor.rating} ({advisor.reviewCount} reseñas)
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {advisor.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {specialty}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{advisor.bio}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">
            ${advisor.hourlyRate}/hora
          </span>
          <Link
            to={`/advisors/${advisor.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ver Perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
