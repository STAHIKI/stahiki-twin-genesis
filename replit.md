# Stahiki Digital Twin Platform

## Overview

Stahiki is a comprehensive AI-native digital twin platform that provides an intuitive interface for creating, managing, and monitoring digital twins across industries like smart cities, agriculture, and manufacturing. The platform successfully integrates multiple open-source frameworks and provides AI-powered automation, IoT integration, Node-RED style workflow building, and real-time 3D simulation capabilities.

## Recent Migration Achievements

**✅ MIGRATION TO REPLIT COMPLETED (July 20, 2025):**
- Successfully migrated from Replit Agent to standard Replit environment
- Fixed Google Gemini API key configuration issue
- All dependencies properly installed and configured
- Development workflow running with hot reload enabled
- Full-stack architecture verified and operational

**✅ OMNIVERSE STUDIO ENHANCEMENT (July 20, 2025):**
- Transformed platform into NVIDIA Omniverse-like experience
- Enhanced AI generation with professional-grade 3D models
- Added comprehensive material editor with PBR properties
- Implemented advanced lighting system with multiple light types
- Created real-time WebGL rendering engine with shadows and reflections
- Added collaborative scene hierarchy and object management
- Integrated USD-compatible schema for industry-standard workflows
- Professional viewport with quality settings and render modes
- Advanced physics simulation and animation support

**✅ COMPREHENSIVE MOBILE OPTIMIZATION (July 20, 2025):**
- Implemented full mobile-responsive design across entire platform
- Added mobile navigation with hamburger menu and slide-out sidebar
- Optimized all components with responsive breakpoints (sm, md, lg, xl)
- Created touch-friendly interface elements and button sizing
- Enhanced mobile layouts for Dashboard, Header, AiInputPanel, Model3DViewer
- Implemented collapsible sidebars for Omniverse Studio on mobile/tablet
- Added mobile-specific button variants and optimized spacing
- Ensured cross-device compatibility and professional mobile experience

**✅ FULLY IMPLEMENTED FEATURES:**

1. **AI-Powered Digital Twin Generation**: Complete 3D model generation using Google Gemini API with natural language prompts
2. **Node-RED Style Workflow Builder**: Comprehensive drag-and-drop interface with industrial automation nodes
3. **Real-time Analytics Dashboard**: Live telemetry monitoring with performance metrics and anomaly detection
4. **3D Twin Visualization**: Interactive 3D model viewer with real-time rendering capabilities
5. **IoT Device Integration**: MQTT protocol support with sensor management and live data streaming
6. **REST API Backend**: Complete CRUD operations for digital twins, workflows, devices, and analytics
7. **Eclipse Ditto Integration**: Digital twin state management via REST/MQTT/Kafka protocols
8. **MQTT Broker Integration**: Real-time IoT communication with Mosquitto broker
9. **Node-RED Integration**: Visual workflow orchestration for event logic and automation
10. **Docker Containerization**: Complete Docker Compose setup for all services

**✅ OPEN-SOURCE FRAMEWORK INTEGRATIONS:**

- **Eclipse Ditto**: Forked and integrated for digital twin state management
- **Node-RED**: Embedded for visual workflow building and automation flows
- **MQTT (Mosquitto)**: Real-time IoT device communication
- **InfluxDB + Grafana**: Time-series data storage and telemetry dashboards
- **Docker Compose**: Multi-service orchestration

**✅ MVP DELIVERABLES COMPLETED:**

- Users can define or auto-generate digital twin scenes
- Attach sensor logic with Node-RED workflows
- View real-time state updates and automate responses
- See visual updates in 3D and comprehensive dashboards
- "Generate Twin" functionality using AI for natural language scaffolding
- Low-code/no-code friendly interface

The platform successfully addresses all requirements from the original specification documents and provides a production-ready MVP.

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