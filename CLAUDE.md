# CLAUDE.md - Coding Guidelines

## Build Commands
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

## Code Style Guidelines
- **Naming**: Use PascalCase for components, camelCase for variables/functions
- **Components**: Arrow function components with explicit props interfaces
- **Imports**: Group React imports first, then third-party, then local (using @/ alias)
- **Types**: Use TypeScript interfaces for props, explicit return types for functions
- **Formatting**: Follow eslint config, preferring single quotes
- **Error Handling**: Use try/catch for async operations, toast notifications for user feedback
- **State Management**: React hooks (useState, useContext), centralized Dexie for local DB
- **CSS**: Tailwind utility classes, shadcn/ui component library
- **JSX**: One component per file, clear hierarchical structure
- **Organization**: src/ directory with components/, pages/, hooks/, lib/ subdirectories

## TypeScript Config
- `noImplicitAny`: true
- `strictNullChecks`: true
- `noUnusedLocals`: true
- Prefer explicit types