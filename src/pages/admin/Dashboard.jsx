import { FiHome, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { mockProperties } from '../../data/mockProperties'

function Dashboard() {
  // Calculate stats from mock data
  const totalProperties = mockProperties.length
  const totalValue = mockProperties.reduce((sum, p) => sum + p.price, 0)
  const avgPrice = totalValue / totalProperties
  const recentListings = mockProperties
    .sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate))
    .slice(0, 5)

  const stats = [
    {
      name: 'Total Properties',
      value: totalProperties,
      icon: FiHome,
      change: '+12%',
      changeType: 'positive',
      color: 'bg-blue-500',
    },
    {
      name: 'Active Users',
      value: '1,234',
      icon: FiUsers,
      change: '+8%',
      changeType: 'positive',
      color: 'bg-green-500',
    },
    {
      name: 'Total Value',
      value: `$${(totalValue / 1000000).toFixed(1)}M`,
      icon: FiDollarSign,
      change: '+23%',
      changeType: 'positive',
      color: 'bg-purple-500',
    },
    {
      name: 'Avg. Property Price',
      value: `$${Math.round(avgPrice / 1000)}K`,
      icon: FiTrendingUp,
      change: '+5%',
      changeType: 'positive',
      color: 'bg-orange-500',
    },
  ]

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Listings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Listings
            </h2>
            <div className="space-y-4">
              {recentListings.map(property => (
                <div
                  key={property.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      ${(property.price / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500">
                      {property.daysOnMarket}d ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Types Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Property Types
            </h2>
            <div className="space-y-4">
              {[
                {
                  type: 'House',
                  count: mockProperties.filter(p => p.propertyType === 'house')
                    .length,
                  color: 'bg-blue-500',
                },
                {
                  type: 'Condo',
                  count: mockProperties.filter(p => p.propertyType === 'condo')
                    .length,
                  color: 'bg-green-500',
                },
                {
                  type: 'Apartment',
                  count: mockProperties.filter(
                    p => p.propertyType === 'apartment'
                  ).length,
                  color: 'bg-purple-500',
                },
                {
                  type: 'Townhouse',
                  count: mockProperties.filter(
                    p => p.propertyType === 'townhouse'
                  ).length,
                  color: 'bg-orange-500',
                },
              ].map(item => {
                const percentage = (item.count / totalProperties) * 100
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {item.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors">
              Add New Property
            </button>
            <button className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
              Manage Users
            </button>
            <button className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
