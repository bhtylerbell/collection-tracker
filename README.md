# Collection Tracker

## What Is It
A full-stack web application for tracking personal collections such as board games, video games, books, movies, and more. Built with Next.js for both personal use and to share with other users, allowing anyone to organize and manage their collections.

## Purpose
- Track personal collections across multiple categories
- Learn and practice modern Next.js tech stack
- Provide a practical, full-featured app for real-world use
- Share with others who want to track their collections

## Core Features (MVP)

### 1. Authentication & User Management
- User registration/login via Supabase Auth
- Profile management
- Public/private collection visibility settings

### 2. Collection Management
- Create collections by category (board games, video games, books, movies, etc.)
- Add items to collections with key details
- Edit/delete items
- Search and filter within collections

### 3. Item Details
- Category-specific fields (e.g., playtime for games, pages for books)
- Status tracking (owned, wishlist, borrowed, sold)
- Custom tags/labels
- Notes/comments
- Images/cover art

### 4. Discovery & Data
- Integration with external APIs to auto-populate item data:
  - BoardGameGeek for board games
  - IGDB for video games
  - OpenLibrary for books
  - TMDB for movies
- Manual entry option for items not in databases

### 5. Viewing & Organization
- Grid/list view toggle
- Sorting options (name, date added, status, etc.)
- Statistics dashboard (total items, collection value, etc.)

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - Component library built on Radix UI
- **React Hook Form + Zod** - Forms & validation

### Backend/Database
- **Supabase** - PostgreSQL database, authentication, and storage buckets
- **Prisma ORM** - Type-safe database access
- **Next.js API Routes** - Server-side logic

### External Services
- **Supabase Storage** - Image/file storage
- **Vercel** - Deployment

## Database Schema (Initial)

### Users
```sql
- id (uuid, primary key)
- email (text, unique)
- name (text)
- avatar_url (text)
- created_at (timestamp)
```

### Collections
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- category (text)
- description (text)
- is_public (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### Items
```sql
- id (uuid, primary key)
- collection_id (uuid, foreign key)
- title (text)
- description (text)
- image_url (text)
- status (text) -- owned, wishlist, borrowed, sold
- custom_fields (jsonb) -- flexible field storage
- tags (text[])
- notes (text)
- added_at (timestamp)
- updated_at (timestamp)
```

### Tags
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- color (text)
- created_at (timestamp)
```

## Development Phases

### Phase 1: Foundation ✅ COMPLETED
- [x] Initialize Next.js project with TypeScript and Tailwind
- [x] Set up Supabase project and configure environment variables
- [x] Install and configure Prisma with Supabase PostgreSQL
- [x] Set up Supabase Auth (email/password)
- [x] Create database trigger for automatic user creation
- [x] Set up dark theme as default
- [x] Install shadcn/ui component library
- [x] Create header navigation with user menu
- [x] Build modern dashboard layout
- [x] Design landing page
- [x] Polish auth pages (login/signup)

### Phase 2: Core Functionality (In Progress)
- [ ] Implement collection CRUD operations
- [ ] Create forms for adding/editing collections
- [ ] Implement item CRUD operations
- [ ] Build item entry forms with manual data input
- [ ] Create basic list view with search/filter
- [ ] Set up Supabase Storage for image uploads

### Phase 3: Enhanced UX
- [ ] Integrate external APIs for auto-populating item data
- [ ] Build grid view for collections
- [ ] Implement advanced filtering and sorting
- [ ] Create statistics dashboard with real data
- [ ] Add public collection sharing functionality
- [ ] Implement tag management system

### Phase 4: Polish
- [ ] Refine mobile responsiveness
- [ ] Optimize performance (lazy loading, caching)
- [ ] Comprehensive error handling and loading states
- [ ] Add user feedback (toasts, confirmations)
- [ ] Testing and bug fixes
- [ ] Deploy to Vercel

## Nice-to-Have Features (Future)
- Import/export collections (CSV/JSON)
- Collection sharing with friends
- Duplicate detection
- Price tracking / valuation over time
- Barcode scanning for quick item entry
- Social features (follow users, like collections, comments)
- Advanced statistics (acquisition timeline, most played, completion rate)
- Wishlist priority ranking
- Loan tracking (who borrowed what)
- Collection comparison with other users

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Git

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_supabase_database_url
```

## Project Structure
```
collection-tracker/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth-related routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── collections/      # Collection-specific components
│   └── items/            # Item-specific components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client and helpers
│   ├── prisma/           # Prisma client
│   └── utils/            # General utilities
├── types/                 # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Contributing
This is a personal learning project, but suggestions and feedback are welcome!

## License
MIT

