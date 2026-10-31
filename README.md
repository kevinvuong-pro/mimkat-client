# Mimkat Client

A modern, full-featured authentication client application built with Next.js 16, React 19, and TypeScript.

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm, yarn, or pnpm

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/kevinvuong-pro/mimkat-client.git
cd mimkat-client
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Copy the example file and set the URL where the API is running:

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 Getting Started

### Development Mode

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
mimkat-client/
├── public/             # Static files
│   └── images/         # Image assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (private)/  # Protected routes
│   │   └── (public)/   # Public routes
│   ├── components/     # Reusable UI components
│   │   └── ui/         # Shadcn/UI components
│   ├── context/        # React Context providers
│   ├── i18n/           # Internationalization
│   │   └── locales/    # Translation files
│   ├── lib/            # Utility functions
│   ├── providers/      # App providers (Query, Theme)
│   ├── services/       # API services
│   └── types/          # TypeScript types
├── components.json     # Shadcn/UI configuration
├── next.config.ts      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm test` - Run Vitest tests

## 🎨 Tech Stack

### Core

- **Next.js 16** - React Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety

### UI/Styling

- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Headless UI Components
- **Lucide React** - Icon Library
- **next-themes** - Theme Management

### Forms & Validation

- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **@hookform/resolvers** - Form Resolvers

### Data Fetching

- **TanStack Query (React Query)** - Server State Management
- **Axios** - HTTP Client

### Code Quality

- **ESLint** - Linting
- **Prettier** - Code Formatting
- **TypeScript ESLint** - TypeScript Linting

## 🌐 Internationalization

The application supports multiple languages:

- English (en)
- Vietnamese (vi)

Translation files are located in `src/i18n/locales/`.

## 🎯 Key Features Implementation

### Protected Routes

Routes under `(private)` folder require authentication.

### API Integration

All API calls are centralized in `src/services/`:

- `auth.ts` - Authentication endpoints
- `users.ts` - User management endpoints
- `sessions.ts` - Session management endpoints

### Error Handling

Centralized error handling in `src/lib/error-handler.ts`

API errors use a stable response shape with `success`, `statusCode`, `error`,
`message`, `timestamp`, and `path`. Validation failures may also include an
`errors` array. Stack traces and internal server details are never expected in
client responses.

### Locale-aware formatting

Dates and numbers are formatted through `src/lib/formatters.ts` using the
active English or Vietnamese locale.

### Theme Support

Light and Dark themes with system preference detection.

## 📝 Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Prettier Plugin for Tailwind CSS** for class sorting

Format your code before committing:

```bash
npm run format
npm run lint:fix
```
