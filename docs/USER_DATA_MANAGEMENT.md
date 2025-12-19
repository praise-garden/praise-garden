# User Data Management System

## Overview

This document describes the implementation of the User Data Management System for the Praise Garden application. The system provides a centralized way to fetch, cache, and manage user-specific data (testimonials, projects, widgets, walls) across all pages of the application.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           APP LAYOUT                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Providers (src/components/Providers.tsx)                    │   │
│  │  ┌───────────────────────────────────────────────────────┐  │   │
│  │  │  AuthProvider (handles authentication state)          │  │   │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │   │
│  │  │  │  UserDataProvider (handles user's app data)     │  │  │   │
│  │  │  │  - testimonials[]                               │  │  │   │
│  │  │  │  - addTestimonial()                             │  │  │   │
│  │  │  │  - updateTestimonial()                          │  │  │   │
│  │  │  │  - removeTestimonial()                          │  │  │   │
│  │  │  │  - refreshTestimonials()                        │  │  │   │
│  │  │  └─────────────────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Files Created

### 1. Types (`src/types/database.ts`)

Defines TypeScript interfaces for all database entities:

- `Testimonial` - User testimonials with author info, rating, content, source
- `CreateTestimonialInput` - Input for creating new testimonials
- `UpdateTestimonialInput` - Input for updating existing testimonials
- `Project` - User projects
- `Widget` - User widgets/embeds
- `Wall` - Wall of Love configurations
- `UserData` - Aggregate type for all user data

### 2. Server Actions (`src/lib/actions/testimonials.ts`)

Server-side functions for testimonial CRUD operations:

| Function | Description |
|----------|-------------|
| `getTestimonials()` | Fetch all testimonials for current user |
| `getTestimonialById(id)` | Fetch a single testimonial by ID |
| `createTestimonial(input)` | Create a new testimonial |
| `updateTestimonial(input)` | Update an existing testimonial |
| `deleteTestimonial(id)` | Delete a testimonial |
| `deleteTestimonials(ids)` | Bulk delete testimonials |

### 3. User Data Context (`src/contexts/UserDataContext.tsx`)

Client-side context provider that:

- Fetches user data ONCE when user authenticates
- Caches data in memory for instant access
- Provides optimistic updates for smooth UX
- Auto-syncs changes to database in background
- Clears data on logout

**Hook:** `useUserData()`

```tsx
const { 
  testimonials,           // Array of user's testimonials
  loading,                // Boolean - initial load state
  testimonialsLoading,    // Boolean - refresh state
  error,                  // String | null - error message
  addTestimonial,         // Function to add testimonial
  updateTestimonial,      // Function to update testimonial
  removeTestimonial,      // Function to delete testimonial
  refreshTestimonials,    // Function to refetch from DB
  clearData,              // Function to clear cached data
} = useUserData()
```

### 4. Providers Component (`src/components/Providers.tsx`)

Wraps all context providers in correct order:

```tsx
<AuthProvider>
  <UserDataProvider>
    {children}
  </UserDataProvider>
</AuthProvider>
```

### 5. Updated Layout (`src/app/layout.tsx`)

Root layout now wraps all pages with providers.

---

## Data Fetching Strategy

### When Data is Fetched

| Event | Fetches from DB? |
|-------|------------------|
| App loads (user logged in) | ✅ Yes (once) |
| User logs in | ✅ Yes (once) |
| Page navigation | ❌ No (uses cache) |
| Add/Update/Delete | ❌ No (optimistic update) |
| Manual refresh | ✅ Yes |
| Browser refresh | ✅ Yes (new session) |
| User logs out | ❌ No (clears cache) |

### Optimistic Updates

When a user performs an action (add/update/delete):

1. **UI updates immediately** (no loading spinner)
2. **Background sync** to database
3. **Rollback** if database operation fails

This provides a snappy, responsive user experience.

---

## Usage Examples

### Access Testimonials in Any Component

```tsx
"use client"

import { useUserData } from "@/contexts/UserDataContext"

function MyComponent() {
  const { testimonials, loading } = useUserData()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {testimonials.map(t => (
        <div key={t.id}>{t.content}</div>
      ))}
    </div>
  )
}
```

### Add a New Testimonial

```tsx
const { addTestimonial } = useUserData()

const handleSubmit = async (data) => {
  const { success, error } = await addTestimonial({
    author_name: data.name,
    author_title: data.title,
    content: data.content,
    rating: data.rating,
    source: 'MANUAL',
  })
  
  if (success) {
    toast.success("Testimonial added!")
  } else {
    toast.error(error || "Failed to add testimonial")
  }
}
```

### Delete a Testimonial

```tsx
const { removeTestimonial } = useUserData()

const handleDelete = async (id: string) => {
  const { success } = await removeTestimonial(id)
  
  if (success) {
    toast.success("Deleted!")
  }
}
```

### Refresh Data

```tsx
const { refreshTestimonials, testimonialsLoading } = useUserData()

<button 
  onClick={refreshTestimonials}
  disabled={testimonialsLoading}
>
  {testimonialsLoading ? "Refreshing..." : "Refresh"}
</button>
```

---

## Database Setup (Supabase)

### Required Table: `testimonials`

```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_title TEXT DEFAULT '',
  author_avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  source TEXT DEFAULT 'MANUAL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX testimonials_user_id_idx ON testimonials(user_id);
CREATE INDEX testimonials_created_at_idx ON testimonials(created_at DESC);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Users can only view their own testimonials
CREATE POLICY "Users can view own testimonials" 
  ON testimonials FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own testimonials
CREATE POLICY "Users can insert own testimonials" 
  ON testimonials FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own testimonials
CREATE POLICY "Users can update own testimonials" 
  ON testimonials FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own testimonials
CREATE POLICY "Users can delete own testimonials" 
  ON testimonials FOR DELETE 
  USING (auth.uid() = user_id);
```

---

## Integration with Existing Pages

### Wall of Love Page (`src/app/wall-of-love/[style]/page.tsx`)

The page now uses `useUserData()` to fetch user testimonials:

```tsx
// Get user testimonials from context
const { testimonials: userTestimonials, loading: testimonialsLoading } = useUserData()

// Transform to match component format
const transformedUserTestimonials = React.useMemo(() => {
  return userTestimonials.map((t, index) => ({
    id: t.id,
    authorName: t.author_name,
    company: t.author_title || 'Company',
    rating: t.rating,
    content: t.content,
    source: t.source,
    date: new Date(t.created_at).toLocaleDateString('en-US', { ... }),
  }))
}, [userTestimonials])

// Uses user testimonials if available, otherwise shows demo data
const allTestimonials = transformedUserTestimonials.length > 0 
  ? transformedUserTestimonials 
  : DEMO_TESTIMONIALS
```

### Widget Canvas Page (`src/app/canvas/[widgetId]/WidgetEditorClient.tsx`)

Similarly uses `useUserData()`:

```tsx
// Get user testimonials from context
const { testimonials: dbTestimonials, loading: testimonialsLoading } = useUserData()

// Transform DB testimonials to the format expected by this component
const userTestimonials: WidgetTestimonial[] = React.useMemo(() => {
  if (dbTestimonials.length === 0) {
    return DEFAULT_DEMO_TESTIMONIALS
  }
  return dbTestimonials.map(t => ({
    id: t.id,
    authorName: t.author_name,
    authorTitle: t.author_title || '',
    rating: t.rating,
    content: t.content,
    source: t.source,
    date: new Date(t.created_at).toLocaleDateString('en-US', { ... }),
  }))
}, [dbTestimonials])
```

### Key Implementation Details:

1. **Fallback to Demo Data**: If user has no testimonials, demo data is shown
2. **Data Transformation**: DB format (`author_name`) → Component format (`authorName`)
3. **Memoization**: `useMemo` prevents unnecessary re-renders
4. **Selected IDs Sync**: Updates when testimonials change via `useEffect`

---

## Next Steps

1. ~~Run the SQL migrations~~ ✅ **DONE** - `testimonials` table created
2. **Test the integration** - Add a testimonial via the app and verify it appears
3. **Add loading states** - Show skeleton loaders during initial fetch
4. **Extend for other data types** (projects, widgets, walls) as needed

---

## File Summary

| File | Purpose |
|------|---------|
| `src/types/database.ts` | TypeScript interfaces for DB entities |
| `src/lib/actions/testimonials.ts` | Server actions for testimonial CRUD |
| `src/contexts/UserDataContext.tsx` | Client context for caching user data |
| `src/components/Providers.tsx` | Wrapper for all context providers |
| `src/app/layout.tsx` | Updated to include Providers |

---

*Created: December 15, 2024*
