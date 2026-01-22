# FollowUpX Architecture

## Core Principles

- **Domain-Driven Design**: Each domain owns its routes, services, and data access with minimal public interfaces.
- **Strict Layer Boundaries**: Routes handle HTTP only, services contain business logic, repositories handle data access. No exceptions.
- **Centralized Cross-Cutting Concerns**: Authentication, authorization, validation, error handling, logging, and response formatting live in shared core modules.
- **Zero Duplication Rule**: Any repeated logic is extracted into shared utilities or services. Copy-paste code is forbidden.
- **Explicit Dependency Direction**: Routes depend on services, services on repositories. Reverse or lateral dependencies are forbidden.
- **Single Source of Truth**: Enums, constants, config, and validation schemas are defined once and imported.
- **Role Logic Isolation**: Role checks live in auth guards or services, never scattered across handlers.
- **Pure Utilities Only**: Utility functions are stateless, deterministic, and side-effect free.
- **Extensibility over Cleverness**: Code allows new domains and features to be added without modifying existing modules.

## Folder Structure

- `app/`: Next.js app router with role-based routes
  - `auth/`: Authentication routes
  - `sales/`: Salesperson routes
  - `manager/`: Manager routes
- `core/`: Shared business logic and infrastructure
  - `api/`: API client functions
  - `auth/`: Authentication services
  - `config/`: Configuration
  - `utils/`: Utility functions
- `design-system/`: Reusable UI components and tokens
  - `tokens/`: Design tokens (colors, typography, etc.)
  - `components/`: Base components
  - `layouts/`: Layout components
- `features/`: UI logic features (no routing)
- `vendor/`: Vendor-specific code
- `follow-up/`: Follow-up specific code

## Rules

- Sales and manager folders never import from each other.
- Design-system contains no business logic.
- Features contain UI logic only, no routing.
- Core contains no UI.
- No role conditionals inside components.
- No business-specific styling in tokens.
- No cross-role imports.
- No backend permission assumptions in frontend.
