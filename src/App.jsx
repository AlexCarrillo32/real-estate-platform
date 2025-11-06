import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import ChatWidget from './components/common/ChatWidget'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route
              path="/admin"
              element={<div className="p-4">Admin Dashboard - Coming Soon</div>}
            />
            <Route
              path="/login"
              element={<div className="p-4">Login Page - Coming Soon</div>}
            />
          </Routes>

          {/* AI Chat Widget - Available on all pages */}
          <ChatWidget />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
