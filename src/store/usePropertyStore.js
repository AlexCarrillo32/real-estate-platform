import { create } from 'zustand'

// Property store for managing property state
const usePropertyStore = create(set => ({
  properties: [],
  selectedProperty: null,
  filters: {
    priceMin: 0,
    priceMax: 10000000,
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    location: '',
  },

  setProperties: properties => set({ properties }),

  setSelectedProperty: property => set({ selectedProperty: property }),

  updateFilters: newFilters =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () =>
    set({
      filters: {
        priceMin: 0,
        priceMax: 10000000,
        bedrooms: null,
        bathrooms: null,
        propertyType: null,
        location: '',
      },
    }),
}))

export default usePropertyStore
