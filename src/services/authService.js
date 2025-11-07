export const authService = {
  // Login
  login: async (email, _password) => {
    // Mock login - in production, this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate API response
    const mockUser = {
      id: 1,
      name: email.includes('admin') ? 'Admin User' : 'John Doe',
      email,
      role: email.includes('admin') ? 'admin' : 'buyer',
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    return {
      user: mockUser,
      token: mockToken,
    }
  },

  // Register
  register: async userData => {
    // Mock registration - in production, this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 1500))

    const { email, name, role } = userData

    // Simulate API response
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      role: role || 'buyer',
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    return {
      user: newUser,
      token: mockToken,
    }
  },

  // Logout
  logout: async () => {
    // Mock logout - in production, this might invalidate the token on the backend
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true }
  },

  // Get current user (verify token)
  getCurrentUser: async () => {
    // Mock get current user - in production, this would verify the JWT token
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No token found')
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock user data
      return {
        id: 1,
        name: 'John Doe',
        email: 'user@example.com',
        role: 'buyer',
      }
    } catch (_error) {
      throw new Error('Authentication failed')
    }
  },

  // Password reset request
  requestPasswordReset: async _email => {
    // Mock password reset request
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { message: 'Password reset email sent' }
  },

  // Reset password
  resetPassword: async (_token, _newPassword) => {
    // Mock password reset
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { message: 'Password reset successful' }
  },

  // Update profile
  updateProfile: async userData => {
    // Mock profile update
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: {
        ...userData,
        id: 1,
      },
    }
  },
}

export default authService
