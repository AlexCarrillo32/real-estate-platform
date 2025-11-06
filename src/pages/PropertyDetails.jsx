import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiMapPin,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiSquare,
} from 'react-icons/fi'
import { mockProperties } from '../data/mockProperties'
import { propertyAssistant } from '../services/PropertyAssistantAgent'
import useChatStore from '../store/useChatStore'

function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const property = mockProperties.find(p => p.id === parseInt(id, 10))
  const { updateCost, updateTokens } = useChatStore()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [isAsking, setIsAsking] = useState(false)

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <Link
            to="/properties"
            className="text-primary-600 hover:text-primary-700"
          >
            Browse all properties
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = price =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)

  const nextImage = () => {
    setCurrentImageIndex(prev =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const handleAskQuestion = async () => {
    if (!question.trim() || isAsking) return

    setIsAsking(true)
    setAnswer(null)

    try {
      const result = await propertyAssistant.answerPropertyQuestion(
        property,
        question
      )

      if (result.error) {
        setAnswer({
          text: 'Sorry, I encountered an error. Please try again.',
          isError: true,
        })
      } else {
        setAnswer({ text: result.answer, cost: result.cost })
        if (result.cost) updateCost(result.cost)
        if (result.tokens) updateTokens(result.tokens)
      }
    } catch (error) {
      setAnswer({
        text: 'Sorry, I encountered an error. Please try again.',
        isError: true,
      })
    }

    setIsAsking(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative bg-black">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/properties')}
            className="absolute top-6 left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative aspect-video max-h-[500px] overflow-hidden rounded-lg">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowLightbox(true)}
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <FiX className="w-8 h-8" />
          </button>
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full"
              >
                <FiChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full"
              >
                <FiChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Property Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price)}
                  </div>
                  {property.hoaFees > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      +${property.hoaFees}/mo HOA
                    </div>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <FiHome className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiHome className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Square Feet</div>
                    <div className="font-semibold">
                      {property.sqft.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Year Built</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Q&A Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ask About This Property
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
                    placeholder="Ask me anything about this property..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isAsking}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={isAsking || !question.trim()}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAsking ? 'Asking...' : 'Ask'}
                  </button>
                </div>

                {answer && (
                  <div
                    className={`p-4 rounded-lg ${
                      answer.isError
                        ? 'bg-red-50 text-red-800'
                        : 'bg-primary-50 text-gray-800'
                    }`}
                  >
                    <p className="mb-1">{answer.text}</p>
                    {answer.cost && (
                      <p className="text-xs opacity-70">
                        Cost: ${answer.cost.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Property Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-semibold capitalize">
                    {property.propertyType}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-green-600">
                    {property.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Days on Market</span>
                  <span className="font-semibold">
                    {property.daysOnMarket} days
                  </span>
                </div>
                {property.lotSize && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-semibold">
                      {property.lotSize} acres
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Price per Sqft</span>
                  <span className="font-semibold">
                    ${Math.round(property.price / property.sqft)}/sqft
                  </span>
                </div>
              </div>

              <button className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Contact Agent
              </button>

              <button className="w-full mt-3 border border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Schedule Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
