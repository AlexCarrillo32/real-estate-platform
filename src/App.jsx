import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'

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
            {/* Add more routes as needed */}
            <Route
              path="/properties"
              element={<div className="p-4">Properties Page - Coming Soon</div>}
            />
            <Route
              path="/admin"
              element={
                <div className="p-4">Admin Dashboard - Coming Soon</div>
              }
            />
            <Route
              path="/login"
              element={<div className="p-4">Login Page - Coming Soon</div>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
