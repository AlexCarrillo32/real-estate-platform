import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user } = useAuthStore()

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If a specific role is required, check if user has it
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate page based on their actual role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/properties" replace />
  }

  // User is authenticated and has correct role (if required)
  return children
}

export default ProtectedRoute
