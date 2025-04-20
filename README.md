# Elvis Todo App

A modern, full-stack todo application built with Next.js, React, and Convex. This application features a beautiful UI with drag-and-drop functionality, real-time updates, and a seamless user experience.

## Live Demo

Experience the application live at [elvis-todo.vercel.app](https://elvis-todo.vercel.app)

![Elvis Todo App Screenshot](https://elvis-todo.vercel.app/image.png)

## Features

- 🎨 Modern UI with Tailwind CSS and custom components
- 🚀 Real-time updates using Convex
- 🖱️ Drag-and-drop task management
- 📱 Responsive design
- 🔄 Type-safe development with TypeScript
- 🎯 Functional components with React Hooks

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Convex
- **Drag & Drop**: dnd-kit
- **State Management**: React Hooks
- **UI Components**: Custom components from components/jj-ui and components/ui

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Convex account and CLI

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/elvis-kemevor/elvis-todo-app.git
cd elvis-todo-app
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

4. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable UI components
  - `ui/` - Base UI components
- `hooks/` - Custom React hooks
- `providers/` - React context providers
- `types/` - TypeScript type definitions
- `lib/` - Utility functions and helpers
- `convex/` - Backend functions and schemas

## Development Guidelines

- Use functional components exclusively
- Avoid using `any` type - always provide proper TypeScript types
- Utilize components from `components/ui` for UI elements
- Follow the existing project structure for new features

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
