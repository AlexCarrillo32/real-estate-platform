import { useState } from 'react'
import { propertyAssistant } from '../../services/PropertyAssistantAgent'
import usePropertyStore from '../../store/usePropertyStore'

function NaturalLanguageSearch({ onSearch }) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { updateFilters } = usePropertyStore()

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await propertyAssistant.parseSearchQuery(query)

      if (result.error) {
        setError(result.error)
      } else {
        // Update filters in the store
        updateFilters(result.filters)

        // Call the onSearch callback if provided
        if (onSearch) {
          onSearch(result.filters)
        }

        // Clear query
        setQuery('')
      }
    } catch (err) {
      setError('Failed to parse search query')
    }

    setIsLoading(false)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const examples = [
    '3 bedroom house under $500k in Austin',
    'Apartments near downtown with 2 baths',
    'Condos with 1500+ sqft',
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🤖 Natural Language Search
        </label>

        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 3 bedroom house under $500k in Austin"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NaturalLanguageSearch
