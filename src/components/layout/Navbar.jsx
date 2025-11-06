import { Link } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Real Estate Platform
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/properties" className="hover:text-primary-600">
              Properties
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-primary-600">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
