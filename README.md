# Recurro Website

A modern, beautiful product website for Recurro - a personal task tracking system for managing recurring tasks.

## Features

- 🌐 **Bilingual Support**: Full English and Korean localization using next-intl
- 🎨 **Modern Design**: Distinctive "Rhythmic Minimalism" aesthetic with circular motifs
- 📱 **Responsive**: Optimized for all device sizes
- ⚡ **Performance**: Built with Next.js 14 App Router for optimal performance
- 🎭 **Animations**: Smooth scroll-triggered animations using Framer Motion
- 🌙 **Dark Mode**: Full dark mode support
- ♿ **Accessible**: WCAG compliant with semantic HTML
- 🔍 **SEO Optimized**: Metadata, OpenGraph tags, and structured data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Animations**: Framer Motion
- **Fonts**: Crimson Pro (serif) + Outfit (sans-serif)

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

The app will be available in both English and Korean:
- English: [http://localhost:3000/en](http://localhost:3000/en)
- Korean: [http://localhost:3000/ko](http://localhost:3000/ko)

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
recurro-website/
├── public/
│   └── screenshots/        # App screenshots
├── src/
│   ├── app/
│   │   └── [locale]/      # Localized routes
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── globals.css
│   ├── components/        # Reusable components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── UseCases.tsx
│   │   ├── WhyChoose.tsx
│   │   ├── Screenshots.tsx
│   │   ├── DownloadSection.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── i18n/             # i18n configuration
│   │   ├── request.ts
│   │   └── routing.ts
│   └── locales/          # Translation files
│       ├── en/
│       │   └── common.json
│       └── ko/
│           └── common.json
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Adding Screenshots

Place your app screenshots in the `public/screenshots/` directory:
- `public/screenshots/1.png` - First screenshot
- `public/screenshots/2.png` - Second screenshot

Recommended dimensions: 350x700px (or similar phone screen aspect ratio)

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },  // Main brand color
  accent: { ... },   // Secondary accent
}
```

### Content

Update translations in:
- `src/locales/en/common.json` (English)
- `src/locales/ko/common.json` (Korean)

### Fonts

The website uses:
- **Crimson Pro** for headings (serif)
- **Outfit** for body text (sans-serif)

To change fonts, update the Google Fonts import in `src/app/[locale]/globals.css` and the font family in `tailwind.config.ts`.

## Design Philosophy

The website follows a **"Rhythmic Minimalism"** design approach:

- **Circular Motifs**: Representing the cyclical nature of recurring tasks
- **Warm Color Palette**: Terracotta and coral tones for approachability
- **Flowing Animations**: Smooth transitions that suggest rhythm and flow
- **Generous Spacing**: Clean, breathable layouts
- **Typography**: Distinctive serif/sans-serif pairing

## SEO & Metadata

Metadata is automatically generated from translation files. Update the `meta` section in each locale's `common.json` file to customize:

- Page title
- Description
- OpenGraph tags
- Twitter Card data

## License

© 2025 Dundin Studio. All rights reserved.
