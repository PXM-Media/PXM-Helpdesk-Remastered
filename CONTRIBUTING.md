# Contributing to PXM Helpdesk Remastered

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/PXM-Media/PXM-Helpdesk-Remastered/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a **title and clear description**, as well as as much relevant information as possible.

### Suggesting Enhancements

- Open a new issue with a clear title and detailed description of the suggested enhancement.
- Explain why this enhancement would be useful to most users.

## Development Setup

1.  **Fork the repository** on GitHub.
2.  **Clone the project** to your own machine.
3.  **Install dependencies**: `npm install`.
4.  **Start Docker Services**: `docker-compose up -d`.
5.  **Push Schema**: `npx turbo db:push`.
6.  **Run the dev server**: `npm run dev`.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Coding Style

- We use **Prettier** for code formatting.
- We use **ESLint** for linting.
- Follow the existing project structure (Turborepo).

## Pull Requests

1.  Push to your fork and submit a Pull Request.
2.  At this point you're waiting on us. We may suggest some changes or improvements or alternatives.
3.  Some things that will increase the chance that your pull request is accepted:
    - Write tests.
    - Follow style guides.
    - Write a good commit message.
