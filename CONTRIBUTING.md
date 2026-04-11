# Contributing to calcula-curp

Thank you for your interest in improving this library!

## Getting Started

```bash
git clone https://github.com/GerardoLucero/calcula-curp.git
cd calcula-curp
npm install
```

## Running Tests

```bash
npm test                 # run all tests
npm run test:coverage    # run tests with coverage report
npm run test:watch       # watch mode during development
```

All PRs must keep coverage above 90%.

## Pull Request Process

1. Fork the repository and create a feature branch:
   `git checkout -b feature/your-feature-name`
2. Make your changes and ensure tests pass: `npm test && npm run lint`
3. Commit with a clear message following conventional commits
   (e.g. `fix: handle edge case for compound surnames`)
4. Push your branch and open a Pull Request against `main`
5. Describe what the PR does and why — link any related issues

## Code Style

- Run `npm run lint` before committing
- Keep functions small and focused
- Add tests for any new logic or bug fix

## Reporting Bugs

Open an issue at https://github.com/GerardoLucero/calcula-curp/issues
with a minimal reproducible example.
