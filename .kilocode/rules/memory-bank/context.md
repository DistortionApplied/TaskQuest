# Active Context: TaskQuest - Gamified Task Management App

## Current State

**App Status**: ✅ Fully Functional Production App

TaskQuest is a complete gamified task management mobile app built with Next.js 16, TypeScript, and Tailwind CSS 4. Features multi-user profiles, progressive XP system, comprehensive reward categories, and mobile-first design. All data stored client-side in localStorage (no external APIs).

## Recently Completed Features

### Core App Features
- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration with dark mode
- [x] ESLint configuration
- [x] Mobile-responsive design with bottom navigation

### Gamification System
- [x] Progressive XP system (100 XP base + 20 XP per level increase)
- [x] 23-tier level title progression (Beginner → God Tier)
- [x] Task completion with XP rewards
- [x] Level-based achievements and progression

### User Management
- [x] Multi-user profile system with username creation
- [x] Profile selection and switching
- [x] Profile management (delete, switch, logout)
- [x] User-specific data isolation

### Task & Reward System
- [x] Request creation with customizable tasks
- [x] Comprehensive reward categories:
  - Smoke: Cigarette, Weed
  - Drink: Hot/Cold beverages (Coffee, Beer, Gin & Tonic, etc.)
  - Entertainment: Computer time, Music (Live/Playlist/Other)
  - Chores: Housework (Indoors/Outdoors), Errands
  - Work: Custom work tasks
  - **Food**: Home Cooking, Dine out, Order in, Other (with Breakfast/Lunch/Dinner/Snack/Other)
- [x] Task completion tracking and progress bars

### UI/UX Features
- [x] Enhanced title screen with branding and feature highlights
- [x] Profile selector with welcome screens
- [x] Dark/light theme support
- [x] Mobile-first responsive design
- [x] Clean, intuitive navigation
- [x] - [x] Completion timestamps in UTC (mm/dd/yyyy h:mm a format)
- [x] Rearrangeable tasks with drag-and-drop, new tasks added to top

### Technical Features
- [x] Client-side data persistence (localStorage)
- [x] SSR-safe hydration handling
- [x] Error boundaries and validation
- [x] Performance optimized builds

## Current App Structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home (Title Screen) | App introduction and profile selection |
| `/requests` | Requests Page | Task management dashboard |
| `/add` | Add Request | Create new requests and tasks |
| `/profile` | Profile Page | User stats, settings, profile management |
| `/request/[id]` | Request Detail | Individual task completion |

### Key Components
- `ProfileSelector`: Multi-user profile management
- `XPBar`: Level progression visualization
- `RequestCard`: Task request display
- `TaskItem`: Individual task completion
- `MobileLayout`: App navigation structure

## Current Focus

TaskQuest is a fully functional, production-ready gamified task management app. The focus is on:
- Maintaining mobile-first user experience
- Adding requested features while preserving core functionality
- Ensuring all data remains client-side (localStorage only)
- Continuous improvement of gamification elements

## Technical Architecture

### Data Storage
- **Client-side only**: All data stored in browser localStorage
- **User isolation**: Each profile has separate data stores
- **No external APIs**: Completely offline-capable

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Package Manager**: Bun
- **Build Tool**: Turbopack

### Key Functions
- `getCurrentUser()`: Current profile management
- `getXpForNextLevel()`: XP progression calculation
- `getLevelTitle()`: Dynamic rank titles
- `getRequestsForCurrentUser()`: User-specific data filtering

## Quick Development Guide

### Adding New Features
1. Update data models in `src/lib/clientData.ts`
2. Create/modify components in `src/components/`
3. Update pages in `src/app/` routes
4. Test with `bun dev` and build with `bun run build`

### Data Persistence
All user data is automatically saved to localStorage. New features should use existing patterns for user-specific data storage.

### UI Components
Follow established patterns in `src/components/ui/` for consistent styling and behavior.

## Session History

| Date | Major Changes |
|------|---------------|
| Initial | Next.js 16 starter template created |
| 2026-04-30 | Core gamified task management app built |
| 2026-04-30 | Converted to client-side localStorage storage |
| 2026-05-01 | Added Music and Work reward categories |
| 2026-05-01 | Fixed dark mode and XP progression |
| 2026-05-01 | Created title screen and restructured navigation |
| 2026-05-01 | Added profile selector with branding |
| 2026-05-01 | Implemented multi-user profile system |
| 2026-05-01 | Added delete current profile functionality |
| 2026-05-01 | Added Food reward category with meal types |
| 2026-05-01 | Extended level titles to 23 tiers (God Tier) |
| 2026-05-03 | Changed timestamp format to mm/dd/yyyy
| 2026-05-03 | Added Water to Cold Drinks reward category
| 2026-05-03 | Added Other option to Hot and Cold Drinks subcategories
| 2026-05-03 | Added Laundry to Indoor Chores
| 2026-05-03 | Made tasks rearrangeable with drag-and-drop, new tasks added to top