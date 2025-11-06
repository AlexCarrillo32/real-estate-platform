import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Properties', href: '/admin/properties', icon: FiGrid },
  { name: 'Users', href: '/admin/users', icon: FiUsers },
  { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
]

function AdminLayout({ children }) {
  const location = useLocation()

  const isActive = href => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-16">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Admin Panel
            </h2>
            <nav className="space-y-2">
              {navigation.map(item => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 mt-16">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
