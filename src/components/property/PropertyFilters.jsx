import { useState, useEffect } from 'react'
import { Listbox } from '@headlessui/react'
import { FiChevronDown, FiX } from 'react-icons/fi'
import usePropertyStore from '../../store/usePropertyStore'

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
]

const bedroomOptions = [
  { value: null, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]

const bathroomOptions = [
  { value: null, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
]

function PropertyFilters({ onFilterChange }) {
  const { filters, updateFilters, clearFilters } = usePropertyStore()
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handlePriceChange = (field, value) => {
    const numValue = value === '' ? 0 : parseInt(value, 10)
    const updatedFilters = { ...localFilters, [field]: numValue }
    setLocalFilters(updatedFilters)
    updateFilters(updatedFilters)
    if (onFilterChange) onFilterChange(updatedFilters)
  }

  const handleSelectChange = (field, value) => {
    const updatedFilters = { ...localFilters, [field]: value }
    setLocalFilters(updatedFilters)
    updateFilters(updatedFilters)
    if (onFilterChange) onFilterChange(updatedFilters)
  }

  const handleLocationChange = e => {
    const { value } = e.target
    const updatedFilters = { ...localFilters, location: value }
    setLocalFilters(updatedFilters)
    updateFilters(updatedFilters)
    if (onFilterChange) onFilterChange(updatedFilters)
  }

  const handleClearFilters = () => {
    clearFilters()
    if (onFilterChange) onFilterChange({})
  }

  const hasActiveFilters =
    localFilters.priceMin > 0 ||
    localFilters.priceMax < 10000000 ||
    localFilters.bedrooms ||
    localFilters.bathrooms ||
    localFilters.propertyType ||
    localFilters.location

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <FiX className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Location Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          value={localFilters.location || ''}
          onChange={handleLocationChange}
          placeholder="City, ZIP, or Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              value={localFilters.priceMin || ''}
              onChange={e => handlePriceChange('priceMin', e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <input
              type="number"
              value={
                localFilters.priceMax === 10000000 ? '' : localFilters.priceMax
              }
              onChange={e => handlePriceChange('priceMax', e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${(localFilters.priceMin || 0).toLocaleString()}</span>
          <span>
            $
            {localFilters.priceMax === 10000000
              ? '10M+'
              : (localFilters.priceMax || 10000000).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <Listbox
          value={localFilters.propertyType || ''}
          onChange={value => handleSelectChange('propertyType', value)}
        >
          <div className="relative">
            <Listbox.Button className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent flex justify-between items-center">
              <span>
                {propertyTypes.find(t => t.value === localFilters.propertyType)
                  ?.label || 'All Types'}
              </span>
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {propertyTypes.map(type => (
                <Listbox.Option
                  key={type.value}
                  value={type.value}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}`
                  }
                >
                  {type.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <Listbox
          value={localFilters.bedrooms}
          onChange={value => handleSelectChange('bedrooms', value)}
        >
          <div className="relative">
            <Listbox.Button className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent flex justify-between items-center">
              <span>
                {bedroomOptions.find(b => b.value === localFilters.bedrooms)
                  ?.label || 'Any'}
              </span>
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {bedroomOptions.map(option => (
                <Listbox.Option
                  key={option.value || 'any'}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bathrooms
        </label>
        <Listbox
          value={localFilters.bathrooms}
          onChange={value => handleSelectChange('bathrooms', value)}
        >
          <div className="relative">
            <Listbox.Button className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent flex justify-between items-center">
              <span>
                {bathroomOptions.find(b => b.value === localFilters.bathrooms)
                  ?.label || 'Any'}
              </span>
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {bathroomOptions.map(option => (
                <Listbox.Option
                  key={option.value || 'any'}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Active filters:{' '}
            {[
              localFilters.location && `"${localFilters.location}"`,
              localFilters.priceMin > 0 &&
                `$${localFilters.priceMin.toLocaleString()}+`,
              localFilters.priceMax < 10000000 &&
                `under $${localFilters.priceMax.toLocaleString()}`,
              localFilters.bedrooms && `${localFilters.bedrooms}+ beds`,
              localFilters.bathrooms && `${localFilters.bathrooms}+ baths`,
              localFilters.propertyType &&
                propertyTypes.find(t => t.value === localFilters.propertyType)
                  ?.label,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}

export default PropertyFilters
