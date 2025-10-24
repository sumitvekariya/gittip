This is a work in progress project by sarkazein.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

- 🚀 Built with Next.js 14+ and React
- 💎 TypeScript support
- 🎨 Tailwind CSS for styling
- 🔐 NextAuth.js for authentication
- 📦 MongoDB integration
- 🎯 Modern UI components with shadcn/ui

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sumitvekariya/gittip.git
cd gittip
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then update the `.env.local` file with your configuration values:
- MongoDB connection string
- NextAuth secrets and providers
- Any other required API keys

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Project Structure

```
gittip/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── actions.json/ # Server actions
│   │   └── auth/         # Authentication routes
│   ├── components/       # React components
│   │   └── ui/           # UI components (shadcn/ui)
│   ├── lib/              # Utility functions and configurations
│   └── providers/        # Context providers
├── public/               # Static assets
└── ...config files
```

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository** and clone it locally
2. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
3. **Make your changes** and commit them using conventional commits
4. **Push to your fork** and submit a pull request

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Example:** `feat: add user authentication system`

### Pull Request Process

1. Ensure your code follows the project's code style
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Link related issues in your PR description

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## FAQ

### Frequently Asked Questions

**Q: What is this project about?**  
A: This is a work-in-progress project built with Next.js, featuring authentication, database integration, and modern UI components. It serves as a full-stack web application template.

**Q: Why use Next.js instead of plain React?**  
A: Next.js provides server-side rendering, API routes, file-based routing, and excellent performance optimizations out of the box, making it ideal for production applications.

**Q: Can I use this as a template for my own project?**  
A: Yes! This project is open source under the MIT License. Feel free to fork it and customize it for your needs.

**Q: What database does this project use?**  
A: The project uses MongoDB for data storage. You can easily swap it for another database by modifying the database connection configuration in `src/lib/mongodb.ts`.

**Q: How do I add new UI components?**  
A: This project uses shadcn/ui components. You can add new components using:
```bash
npx shadcn-ui@latest add [component-name]
```

**Q: Is this project production-ready?**  
A: This is currently a work-in-progress project. While it includes production-grade tools and practices, make sure to review and test thoroughly before deploying to production.

**Q: How can I contribute?**  
A: Check out the [Contributing](#contributing) section for guidelines on how to contribute to the project!

## Troubleshooting

### Common Issues and Solutions

#### Dependencies Installation Failed

If you encounter errors during `pnpm install` or `npm install`:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install
# or
npm install
```

#### Environment Variables Not Loading

Ensure your `.env.local` file is:
- In the root directory
- Not committed to git (check `.gitignore`)
- Has all required variables from `.env.example`

Restart the development server after making changes to environment variables.

#### Port Already in Use

If you see "Port 3000 is already in use":

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Then restart the dev server
pnpm dev
```

#### MongoDB Connection Issues

- Verify your MongoDB connection string is correct
- Ensure your IP address is whitelisted (for cloud databases)
- Check if MongoDB service is running (for local databases)

#### TypeScript Errors

If you encounter TypeScript compilation errors:

```bash
# Clear TypeScript cache
rm -rf .next
# Reinstall type definitions
pnpm add -D @types/node @types/react @types/react-dom
# Restart the dev server
pnpm dev
```

#### Build Failures

If production build fails:

```bash
# Run build with verbose output
pnpm build --debug
# Check for missing environment variables
# Ensure all imports are correct
```

#### Hot Reload Not Working

If changes aren't reflecting in the browser:
- Clear browser cache
- Stop the dev server and restart: `pnpm dev`
- Check for syntax errors in your code
- Disable browser extensions that might interfere

#### Authentication Issues

If you're having problems with NextAuth.js:

```bash
# Verify environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

- Ensure `NEXTAUTH_SECRET` is set (generate with: `openssl rand -base64 32`)
- Check provider credentials (GitHub, Google, etc.)
- Clear cookies and session storage in browser

#### Styling Not Applied

If Tailwind CSS styles aren't working:
- Check `tailwind.config.ts` for correct content paths
- Verify `globals.css` imports Tailwind directives
- Restart dev server after config changes
- Clear `.next` folder: `rm -rf .next`

#### API Routes 404 Errors

If API routes return 404:
- Verify file is in correct location (`src/app/api/`)
- Check file naming (must be `route.ts` or `route.js`)
- Ensure proper HTTP method handler is exported (GET, POST, etc.)
- Restart development server

### Getting Help

If you're still experiencing issues:
- Check [GitHub Issues](https://github.com/sumitvekariya/gittip/issues) for similar problems
- Create a new issue with detailed error messages and steps to reproduce
- Join our community discussions for support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 [sarkazein](https://github.com/sumitvekariya)

---

Note: This line was added to test PR merge detection.

Note: Testing PR linking for issue #11.

Note: Testing PR linking for issue #14.

Note: Testing PR linking for issue #16.

Note: Testing PR linking for issue #18.

Note: Testing PR linking for issue #20.

Note: Testing PR linking for issue #22.

Note: Testing PR linking for issue #24.

Note: Testing PR linking for issue #26.

Note: Testing PR linking for issue #28.

Note: Testing PR linking for issue #30.

Note: Testing PR linking for issue #32.

Note: Testing PR linking for issue #34.

Note: Testing PR linking for issue #36.
Note: Testing PR linking for issue #68.

Note: Testing PR linking for issue #72.
