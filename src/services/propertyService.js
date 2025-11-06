import apiClient from './api'

// Property service following CLAUDE.md best practices
export const propertyService = {
  // Get all properties with filters
  getProperties: async filters => {
    const params = new URLSearchParams(filters).toString()
    return apiClient.get(`/properties?${params}`)
  },

  // Get single property by ID
  getPropertyById: async id => {
    return apiClient.get(`/properties/${id}`)
  },

  // Create new property (admin only)
  createProperty: async propertyData => {
    return apiClient.post('/properties', propertyData)
  },

  // Update property (admin only)
  updateProperty: async (id, propertyData) => {
    return apiClient.put(`/properties/${id}`, propertyData)
  },

  // Delete property (admin only)
  deleteProperty: async id => {
    return apiClient.delete(`/properties/${id}`)
  },

  // Search properties (Zillow API integration)
  searchZillow: async searchParams => {
    return apiClient.post('/zillow/search', searchParams)
  },
}
