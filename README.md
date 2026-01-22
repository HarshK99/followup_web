# FollowUpX Web App

A Next.js application with strict role-based route separation, reusable design system, and zero business coupling between sales and manager experiences.

## Architecture Overview

### Core Principles
- **Role-based routing**: Role resolved once at login, immediate redirect to role home
- **No shared pages**: Sales and manager routes are completely separate
- **Layout selection by route group**: Sales (mobile-first), Manager (desktop-first)
- **Zero coupling**: Sales and manager folders never import from each other
- **Design system isolation**: No business logic in design-system, pure UI components
- **Domain-driven structure**: Each domain owns routes, services, data access with minimal public interface

### Folder Structure
```
app/
  auth/          # Authentication routes
  sales/         # Sales-specific routes
  manager/       # Manager-specific routes
core/
  api/           # API utilities
  auth/          # Authentication services
  config/        # Configuration
  utils/         # Shared utilities
design-system/
  tokens/        # Design tokens (colors, typography, spacing)
  components/    # Base UI components
  layouts/       # Layout components
features/        # UI logic only, no routing
vendor/          # Third-party integrations
follow-up/       # Business-specific modules
```

### Routes
- `/auth/*` - Authentication
- `/sales/*` - Sales experience
- `/manager/*` - Manager experience

### Design System
- **Tokens**: Colors, typography, spacing, border radius, shadows
- **Components**: Button, Text, Input, Select, Card, Badge, ListItem
- **Layouts**: AuthLayout, SalesLayout (mobile-first), ManagerLayout (desktop-first)

## Strict Rules

### Separation of Concerns
- **sales** and **manager** folders never import from each other
- **design-system** contains no business logic
- **features** contain UI logic only, no routing
- **core** contains no UI

### Layer Boundaries
- Routes handle HTTP only
- Services contain business logic
- Repositories handle all data access
- No exceptions to these boundaries

### Cross-cutting Concerns
- Authentication, authorization, validation, error handling, logging centralized in core modules
- Reused everywhere

### Code Quality
- **Zero duplication**: Any repeated logic extracted to shared utilities/services
- **Single source of truth**: Enums, constants, config, validation schemas defined once
- **Role logic isolation**: Role checks in auth guards/services, never scattered
- **Pure utilities**: Stateless, deterministic, side-effect free
- **Extensibility**: New domains/features added without modifying existing modules

### Dependency Direction
- Routes may depend on services
- Services on repositories
- Reverse/lateral dependencies forbidden

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. Login with test credentials:
   - Sales: `sales@example.com` / `password`
   - Manager: `manager@example.com` / `password`

## Development Guidelines

- Always check for existing shared utilities before implementing new logic
- Use design system components for all UI
- Keep business logic out of components and layouts
- Test components in isolation from business logic
- Follow the dependency direction strictly
- Extract repeated code immediately
