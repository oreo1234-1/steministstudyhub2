# STEMinist Study Hub

## Overview

STEMinist Study Hub is a comprehensive educational platform designed to support underrepresented groups, particularly women, in STEM fields. The platform combines traditional learning resources with modern AI-powered tools, community features, and gamification elements to create an engaging and supportive learning environment. It serves as a hub for study materials, mentorship connections, interactive workshops, and peer-to-peer support through forums and gamification systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a React-based single-page application (SPA) built with TypeScript and Vite. The frontend follows a component-based architecture with:

- **UI Framework**: React with TypeScript for type safety and better development experience
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with a custom design system featuring pink/lavender and dark green color scheme
- **Component Library**: Shadcn/ui components providing pre-built, accessible UI components
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The backend follows a RESTful API design using Express.js with TypeScript:

- **Server Framework**: Express.js with TypeScript for API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Structure**: RESTful endpoints organized by resource type (profiles, study materials, forums, workshops)
- **Data Validation**: Zod schemas for runtime type checking and API validation
- **Authentication Context**: Supabase Auth integration for user management

### Data Storage Solutions
The application uses a PostgreSQL database with the following architectural decisions:

- **Database**: PostgreSQL via Neon serverless for scalability and performance
- **ORM**: Drizzle ORM chosen for type safety and performance over traditional ORMs
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Connection Pooling**: Neon serverless connection pooling for efficient database access

### Authentication and Authorization
Authentication is handled through Supabase Auth with custom profile management:

- **Auth Provider**: Supabase Auth for secure user authentication and session management
- **Profile System**: Custom profile schema extending Supabase auth with additional user data
- **Role-based Access**: App role enum supporting student, mentor, and admin roles
- **Onboarding Flow**: Multi-step onboarding process for new user data collection

### Database Schema Design
The database schema is designed around educational platform needs:

- **Profiles**: Extended user profiles with STEM interests, goals, and portfolio data
- **Study Materials**: Categorized learning resources with approval workflow
- **Forum System**: Community discussion posts with categories and engagement metrics
- **Workshops**: Scheduled learning sessions with instructor information
- **Gamification**: Points, badges, and user activity tracking for engagement
- **Opportunities**: Scholarships, internships, and competitions listings

### AI Integration Architecture
The platform integrates OpenAI services through Supabase Edge Functions:

- **AI Functions**: Serverless functions for flashcard generation, text summarization, study planning, and chatbot interactions
- **Service Pattern**: Each AI feature implemented as a separate edge function for modularity
- **API Integration**: OpenAI GPT-4 integration with custom prompts optimized for STEM education
- **Error Handling**: Comprehensive error handling and fallback mechanisms for AI services

## External Dependencies

### Database and Backend Services
- **Neon Database**: Serverless PostgreSQL database for data persistence
- **Supabase**: Backend-as-a-Service providing authentication, database, and edge functions
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations

### AI and Machine Learning
- **OpenAI API**: GPT-4 integration for AI-powered study tools including flashcard generation, text summarization, chatbot responses, and study plan creation

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Shadcn/ui**: Pre-built component library based on Radix UI and Tailwind
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking for both frontend and backend
- **React Query**: Server state management and caching
- **React Hook Form**: Performant form library with validation
- **Zod**: Runtime type validation and schema definition

### Authentication and Session Management
- **Supabase Auth**: Complete authentication solution with social providers support
- **Connect PG Simple**: PostgreSQL session store for Express sessions