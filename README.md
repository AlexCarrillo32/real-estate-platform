# Real Estate Platform

A modern, full-featured real estate platform built with React, featuring property listings, advanced search, admin management, and Zillow API integration.

## Features

- **Property Search & Browse** - Advanced filters, real-time Zillow API data
- **Admin Dashboard** - Property management, analytics, user administration
- **Modern UI/UX** - Built with Tailwind CSS v4, fully responsive
- **State Management** - Zustand for global state, TanStack Query for server state
- **Form Handling** - React Hook Form for performant forms

## Tech Stack

- React 19.1 + Vite 7.x
- React Router 7.x + TanStack Query
- Zustand + Axios
- Tailwind CSS v4
- ESLint 9.x + Prettier

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your Zillow API key to .env
# VITE_ZILLOW_API_KEY=your_key

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/      # UI components (common, layout, property, admin, auth)
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API services
├── store/           # Zustand stores
├── utils/           # Utilities
└── config/          # Configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

## License

MIT
