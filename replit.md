# Stahiki Digital Twin Platform

## Overview

Stahiki is a comprehensive digital twin platform that provides an intuitive interface for creating, managing, and monitoring digital twins across various industries. The platform combines AI-powered automation, IoT integration, workflow building, and real-time simulation capabilities to streamline digital twin development and operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with the following key characteristics:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with Node.js runtime
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Development Environment**: Optimized for Replit with hot module replacement

## Key Components

### Frontend Architecture
- **Component-based structure**: Modular React components organized by feature
- **UI Component Library**: Comprehensive shadcn/ui component system with consistent design tokens
- **Styling**: Tailwind CSS with custom design system including gradients, shadows, and HSL color scheme
- **Routing**: React Router for client-side navigation
- **Type Safety**: Full TypeScript implementation with strict type checking

### Backend Architecture
- **Express.js Server**: RESTful API structure with middleware for logging and error handling
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Development Setup**: Vite integration for development mode with HMR support
- **Production Build**: ESBuild for server bundling with external package handling

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Schema Validation**: Drizzle-zod integration for runtime type validation
- **Migration Support**: Drizzle-kit for database schema migrations

## Data Flow

1. **Client Requests**: React frontend makes API calls to Express backend
2. **API Processing**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Drizzle ORM manages database interactions with type safety
4. **Response Handling**: TanStack Query manages caching and state synchronization
5. **UI Updates**: React components re-render based on updated state

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon serverless for production scaling
- **UI Components**: Radix UI primitives for accessibility and interaction patterns
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Date Handling**: date-fns for date manipulation and formatting

### Development Tools
- **Build System**: Vite with React plugin for fast development
- **Type Checking**: TypeScript with strict configuration
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer
- **Development Experience**: Replit-specific plugins for runtime error handling and cartographer

### Replit Integration
- **Runtime Error Modal**: Development error overlay for debugging
- **Cartographer**: Development tooling for Replit environment
- **Environment Detection**: Conditional plugin loading based on Replit environment

## Deployment Strategy

### Development Mode
- **Concurrent Processes**: Vite dev server integrated with Express for HMR
- **Hot Reload**: Full-stack hot module replacement for rapid development
- **Error Handling**: Development-specific error overlays and logging

### Production Build
- **Client Build**: Vite builds React app to static assets in `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built client assets in production
- **Process Management**: Single Node.js process serving both API and static content

### Database Configuration
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection
- **Migration Strategy**: Drizzle-kit handles schema changes with `db:push` command
- **Connection Pooling**: Neon serverless handles connection management automatically

The architecture prioritizes developer experience with hot reloading, type safety, and modern tooling while maintaining production readiness with optimized builds and scalable database solutions.