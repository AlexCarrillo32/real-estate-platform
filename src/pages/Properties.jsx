import { useState, useMemo } from 'react'
import { Listbox } from '@headlessui/react'
import { FiChevronDown } from 'react-icons/fi'
import PropertyCard from '../components/property/PropertyCard'
import PropertyFilters from '../components/property/PropertyFilters'
import NaturalLanguageSearch from '../components/property/NaturalLanguageSearch'
import usePropertyStore from '../store/usePropertyStore'
import {
  mockProperties,
  filterProperties,
  sortProperties,
} from '../data/mockProperties'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'beds-desc', label: 'Most Bedrooms' },
  { value: 'sqft-desc', label: 'Largest First' },
]

const PROPERTIES_PER_PAGE = 9

function Properties() {
  const { filters } = usePropertyStore()
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort properties
  const filteredAndSorted = useMemo(() => {
    const filtered = filterProperties(mockProperties, filters)
    return sortProperties(filtered, sortBy)
  }, [filters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / PROPERTIES_PER_PAGE)
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE
  const endIndex = startIndex + PROPERTIES_PER_PAGE
  const currentProperties = filteredAndSorted.slice(startIndex, endIndex)

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Natural Language Search */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
          <p className="text-xl mb-6 opacity-90">
            Browse our selection of {mockProperties.length} properties
          </p>
          <NaturalLanguageSearch />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-4">
              <PropertyFilters onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Properties Grid */}
          <main className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredAndSorted.length} Properties Found
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredAndSorted.length)} of{' '}
                  {filteredAndSorted.length}
                </p>
              </div>

              {/* Sort Dropdown */}
              <Listbox value={sortBy} onChange={setSortBy}>
                <div className="relative">
                  <Listbox.Button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <span className="text-sm font-medium">
                      {sortOptions.find(o => o.value === sortBy)?.label}
                    </span>
                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute right-0 z-10 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {sortOptions.map(option => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 text-sm ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}`
                        }
                      >
                        {option.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Properties Grid */}
            {currentProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        pageNum => {
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                  currentPage === pageNum
                                    ? 'bg-primary-600 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNum}
                                className="px-2 text-gray-500"
                              >
                                ...
                              </span>
                            )
                          }
                          return null
                        }
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Properties
