import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { mockProperties } from '../../data/mockProperties'

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(1000, 'Price must be at least $1,000'),
  bedrooms: z.number().min(1, 'Must have at least 1 bedroom'),
  bathrooms: z.number().min(1, 'Must have at least 1 bathroom'),
  sqft: z.number().min(100, 'Square footage must be at least 100'),
  propertyType: z.enum(['house', 'condo', 'apartment', 'townhouse']),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  yearBuilt: z.number().min(1800, 'Year built must be valid'),
  lotSize: z.number().nullable(),
  hoaFees: z.number().min(0, 'HOA fees must be 0 or greater'),
})

function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 0,
      propertyType: 'house',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      yearBuilt: new Date().getFullYear(),
      lotSize: null,
      hoaFees: 0,
    },
  })

  // Load property data if editing
  useEffect(() => {
    if (isEditMode) {
      const property = mockProperties.find(p => p.id === parseInt(id, 10))
      if (property) {
        Object.keys(property).forEach(key => {
          if (key in propertySchema.shape) {
            setValue(key, property[key])
          }
        })
        setSelectedImages(property.images || [])
      }
    }
  }, [id, isEditMode, setValue])

  const onSubmit = async data => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (isEditMode) {
        console.log('Updating property:', id, data)
      } else {
        console.log('Creating property:', data)
      }

      // Navigate back to property management
      navigate('/admin/properties')
    } catch (error) {
      console.error('Error saving property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = e => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setSelectedImages([...selectedImages, ...imageUrls])
  }

  const removeImage = index => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/properties"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode
              ? 'Update property information'
              : 'Fill in the details to list a new property'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Modern Downtown Loft"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the property..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="450000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  {...register('propertyType')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.propertyType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  {...register('bedrooms', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  {...register('bathrooms', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  step="0.5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <input
                  {...register('sqft', { valueAsNumber: true })}
                  type="number"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.sqft ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.sqft && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sqft.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  {...register('yearBuilt', { valueAsNumber: true })}
                  type="number"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.yearBuilt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.yearBuilt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.yearBuilt.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size (acres)
                </label>
                <input
                  {...register('lotSize', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HOA Fees ($/month)
                </label>
                <input
                  {...register('hoaFees', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.hoaFees ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hoaFees && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hoaFees.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Main St"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Austin"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  {...register('state')}
                  type="text"
                  maxLength="2"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="TX"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  {...register('zipCode')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="78701"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Images</h2>
            <div className="mb-4">
              <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <div className="flex flex-col items-center">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload images
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiUpload className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                  ? 'Update Property'
                  : 'Create Property'}
            </button>
            <Link
              to="/admin/properties"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default PropertyForm
