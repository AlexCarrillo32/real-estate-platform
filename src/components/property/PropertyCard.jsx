import { Link } from 'react-router-dom'

function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    bedrooms,
    bathrooms,
    sqft,
    address,
    imageUrl,
    propertyType,
  } = property

  const formatPrice = price => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link to={`/properties/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
        <img
          src={imageUrl || '/placeholder-property.jpg'}
          alt={title}
          className="w-full h-48 object-cover"
        />

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(price)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{address}</p>

          <div className="flex justify-between items-center text-sm text-gray-700">
            <div className="flex space-x-4">
              <span>{bedrooms} Beds</span>
              <span>{bathrooms} Baths</span>
              <span>{sqft} sqft</span>
            </div>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
              {propertyType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
