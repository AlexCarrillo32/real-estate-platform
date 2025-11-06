import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Authentication store using Zustand
const useAuthStore = create(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('authToken', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('authToken')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: user => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
