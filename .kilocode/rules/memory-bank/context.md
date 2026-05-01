# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a clean Next.js 16 starter with TypeScript and Tailwind CSS 4. It's ready for AI-assisted expansion to build any type of application.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] File-based data storage using JSON files
- [x] Gamified task management mobile app with XP system, levels, and rewards
- [x] Added Chores reward category with housework (indoors/outdoors) and errands subcategories
- [x] Verified app uses NO APIs - all data stored client-side in localStorage
- [x] Added Music subcategory to Entertainment with Live, Playlist, and Other subcategories
- [x] Added new Work category with Custom subcategory
- [x] Fixed mergeRewardCategories to do deep recursive merge so existing localStorage users receive new subcategories (Music, Work) on next load
- [x] Added "Clear All Data" Danger Zone section to profile page (localhost:3000/profile)
- [x] Fixed dark mode toggle functionality by adding Tailwind CSS 4 @custom-variant dark configuration and correcting swapped sun/moon icons
- [x] Updated XP progression system: Level 1-2 requires 100 XP, each subsequent level increases by 20 XP (Level 2-3: 120 XP, Level 3-4: 140 XP, etc.)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The app is a working gamified task management mobile app with no external APIs - all data is stored client-side using localStorage. Future changes must maintain this API-free architecture.

Next steps:
1. Add requested features while preserving API-free design
2. Ensure all new functionality uses localStorage for data persistence
3. Maintain mobile-first responsive design

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-04-30 | Built gamified task management mobile app with database, XP system, and mobile UI |
| 2026-04-30 | Converted from database to file-based storage using JSON files |
| 2026-05-01 | Added Music subcategory to Entertainment and new Work category |
| 2026-05-01 | Fixed deep merge of reward categories so returning users get new nested subcategories |
| 2026-05-01 | Fixed dark mode toggle functionality by adding Tailwind CSS 4 @custom-variant dark configuration and correcting swapped sun/moon icons |
| 2026-05-01 | Updated XP progression system: Level 1-2 requires 100 XP, each subsequent level increases by 20 XP |
