import { StarIcon } from '@heroicons/react/20/solid';

const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'Sarah Johnson',
    rating: 5,
    date: '2024-02-10',
    comment: '¡Asesor excelente! Proporcionó consejos financieros claros y prácticos que me ayudaron a tomar mejores decisiones de inversión.'
  },
  {
    id: 2,
    author: 'Michael Chen',
    rating: 4,
    date: '2024-02-08',
    comment: 'Muy conocedor y profesional. Lo recomendaría a cualquiera que busque orientación en inversiones.'
  }
];

export default function ReviewList() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reseñas</h2>
      <div className="space-y-6">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-5 w-5 ${
                        index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {review.author}
                </span>
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
