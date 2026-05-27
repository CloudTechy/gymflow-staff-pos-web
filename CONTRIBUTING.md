# Contributing to GymFlow Staff POS

Thank you for your interest in contributing to GymFlow Staff POS! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/gymflow-staff-pos-web.git
cd gymflow-staff-pos-web
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/CloudTechy/gymflow-staff-pos-web.git
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local API URLs.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Lint your code
npm run lint

# Build to check for errors
npm run build

# Test manually in browser
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to GitHub and create a pull request
- Fill out the PR template
- Link any related issues
- Wait for review

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict mode

### React Components

- Use functional components
- Use hooks instead of class components
- Keep components small and focused
- Extract reusable logic into custom hooks

Example:
```typescript
import { useState } from 'react';

interface Props {
  title: string;
  onSave: (data: string) => void;
}

export default function MyComponent({ title, onSave }: Props) {
  const [data, setData] = useState('');

  return (
    <div>
      <h1>{title}</h1>
      {/* Component JSX */}
    </div>
  );
}
```

### State Management

- Use Zustand for global state
- Keep state as close to usage as possible
- Use derived state when appropriate
- Avoid prop drilling

### Styling

- Use Tailwind CSS classes
- Follow existing patterns
- Use custom classes from `globals.css`
- Keep inline styles minimal

Example:
```tsx
<button className="btn-primary">
  Click Me
</button>
```

### File Organization

```
src/
├── app/              # Next.js pages
├── components/       # Reusable components
├── hooks/           # Custom React hooks
├── lib/             # Core libraries (API, DB, etc.)
├── store/           # Zustand stores
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useNetworkStatus.ts`)
- **Utils**: camelCase (e.g., `syncService.ts`)
- **Types**: PascalCase (e.g., `Product`, `Sale`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(cart): add quantity validation

- Prevent negative quantities
- Show error message for invalid input
- Update tests

Closes #123
```

```
fix(auth): resolve login redirect issue

Fixed infinite redirect loop when user is already authenticated.

Fixes #456
```

```
docs(readme): update installation instructions

Added more detailed steps for environment setup.
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject line with period
- Use body to explain what and why, not how

## Pull Request Process

### Before Creating PR

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Build succeeds
- [ ] Linting passes
- [ ] Tested in browser

### PR Description

Provide:
1. **Summary**: Brief description of changes
2. **Motivation**: Why is this change needed?
3. **Changes**: List of modifications
4. **Testing**: How to test the changes
5. **Screenshots**: For UI changes
6. **Related Issues**: Link issues this PR addresses

### Review Process

1. Maintainers will review your PR
2. Address feedback and comments
3. Make requested changes
4. Push updates to your branch
5. Once approved, maintainer will merge

### After Merge

- Delete your feature branch
- Update your local repository:
```bash
git checkout main
git pull upstream main
```

## Testing

### Manual Testing

1. Start development server
2. Test all affected features
3. Try edge cases
4. Test offline functionality
5. Verify on different browsers

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (if available)
- Edge (latest)

### Offline Testing

1. Open DevTools
2. Go to Network tab
3. Select "Offline" throttling
4. Test functionality
5. Go back online and verify sync

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex logic
- Explain non-obvious behavior
- Update type definitions

Example:
```typescript
/**
 * Synchronizes pending transactions with the server
 * @throws {Error} If sync fails after max retries
 */
async function syncPendingTransactions(): Promise<void> {
  // Implementation
}
```

### User Documentation

- Update README.md for major features
- Update USER_GUIDE.md for user-facing changes
- Update API_DOCUMENTATION.md for API changes
- Add deployment notes to DEPLOYMENT.md

### README Updates

When adding features:
- Update feature list
- Add usage examples
- Update screenshots
- Update dependencies list

## Questions?

- Open an issue for discussion
- Ask in pull request comments
- Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to GymFlow Staff POS! 🎉
