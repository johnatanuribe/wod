# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, built with TypeScript, React 19, and Tailwind CSS v4.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19
- **Styling**: Tailwind CSS v4 (using new @tailwindcss/postcss plugin)
- **Language**: TypeScript with strict mode enabled
- **Fonts**: Geist Sans and Geist Mono (via next/font/google)

### Project Structure
- `app/` - Next.js App Router directory
  - `layout.tsx` - Root layout with font configuration and metadata
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind v4 imports and CSS variables
- `public/` - Static assets
- Path aliases configured: `@/*` maps to project root

### Styling Configuration
- Uses Tailwind CSS v4 with inline theme configuration in globals.css
- CSS custom properties for theming (--background, --foreground)
- Dark mode via prefers-color-scheme media query
- Font variables: --font-geist-sans and --font-geist-mono

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (automatic runtime)
- Module resolution: bundler
- Path alias: @/* for imports from root

## Important Notes

- This project uses Tailwind CSS v4 which has breaking changes from v3. The configuration is now in globals.css using `@theme inline` instead of tailwind.config.js
- Next.js 16 uses the App Router by default - all pages must be in the app/ directory
- React 19 is used, which may have different behavior than React 18
