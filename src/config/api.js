// API Configuration following CLAUDE.md best practices
const config = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  zillowAPI: {
    key: import.meta.env.VITE_ZILLOW_API_KEY,
    url: import.meta.env.VITE_ZILLOW_API_URL,
  },
  timeout: 10000,
}

export default config
