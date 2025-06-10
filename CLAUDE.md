# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run start` (uses Vite dev server)
- **Build for production**: `npm run build` (includes TypeScript compilation)
- **Preview production build**: `npm run preview`

## Architecture

This is a React-based emoji search application built with Vite and TypeScript. The app is a single-page application using React Router.

### Key Components Structure

- **App.tsx**: Main application entry with router configuration and all components
- **LandingPage**: Root page component containing header, main content, and footer
- **EmojiForm**: Search interface with debounced input and URL parameter sync
- **EmojiResults**: Displays filtered emoji results using match-sorter
- **EmojiButton**: Individual emoji item with copy-to-clipboard functionality

### Data Flow

The app loads all emojis from the `emoji-api` package at startup. Search is handled client-side using `match-sorter` against emoji properties (name, fancyName, formattedName, group, subGroup). Search state is synchronized with URL search parameters for shareable links.

### Key Dependencies

- **emoji-api**: Source of all emoji data
- **match-sorter**: Powers the search functionality
- **react-router-dom**: URL parameter management for search state
- **tailwind-merge**: Dynamic CSS class composition
- **lodash-es**: Debounced search input

### Styling

Uses Tailwind CSS v4 with a dark theme color scheme (slate/indigo palette). The design is responsive with mobile-first approach.