# Authentication Implementation Guide

This document explains the complete authentication system implemented using **Supabase SSR** with proper separation between client-side UX and server-side security.

## Architecture Philosophy

### Client-Side Auth (UX Layer)
- Handles login forms, logout buttons, user avatars, navigation
- Makes the app feel responsive and interactive
- Located in: Client Components, AuthContext

### Server-Side Auth (Security Layer)
- Protects pages, API routes, and data access **before** code reaches the browser
- Prevents auth flashes and unauthorized access
- Located in: Middleware, Server Components, API Routes, Database RLS

## Security Layers (Defense in Depth)

### Layer 1: Middleware (Edge Protection)
**File:** `middleware.ts`

- Runs at the CDN edge **before** any page loads
- Protects `/dashboard/*` and `/congratulations` routes
- Redirects unauthenticated users to `/login`
- Refreshes session tokens automatically

### Layer 2: Server Components (Server Protection)
**Files:** `src/app/dashboard/**/*.tsx`, `src/app/congratulations/page.tsx`

- Verify auth on every protected page
- Fetch data securely on the server
- No auth flash, no client-side redirect delay

### Layer 3: API Routes (Server Protection)
**Files:** `src/app/api/**/*.ts`

- Authenticate user from session
- Authorize resource ownership
- Return appropriate HTTP status codes (401, 403, 500)

### Layer 4: Database RLS (Database Protection)
**File:** `supabase/migrations/001_rls_policies.sql`

- Enforce access control at the database level
- Protection even if application code is compromised
- Must be applied manually in Supabase

### Layer 5: Client Components (UX Layer)
**Files:** Client components with `"use client"` directive

- Handle UX and user interactions
- Display appropriate UI based on auth state
- NOT for security - security is server-side

## File Structure

```
praise-garden/
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser client (UX)
│   │   │   ├── server.ts          # Server client (Security)
│   │   │   └── middleware.ts      # Middleware client (Edge)
│   │   └── auth/
│   │       └── server-auth.ts     # Server auth utilities
│   ├── contexts/
│   │   └── AuthContext.tsx        # Client auth context (UX)
│   ├── components/
│   │   └── SignOutButton.tsx      # Client component example
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     # Client Component (form)
│   │   │   └── signup/page.tsx    # Client Component (form)
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Server Component (protected)
│   │   │   ├── forms/page.tsx     # Client Component (protected by middleware)
│   │   │   ├── form-builder/page.tsx
│   │   │   └── video-testimonial/page.tsx
│   │   ├── congratulations/page.tsx
│   │   └── api/
│   │       └── forms/
│   │           ├── route.ts       # Protected API
│   │           └── [formId]/route.ts  # Protected + authorized API
│   └── middleware.ts              # Route protection (root)
└── supabase/
    └── migrations/
        └── 001_rls_policies.sql   # Database security
```

## How to Use

### In Server Components
```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');
  
  return <div>Protected content</div>;
}
```

### In Client Components
```typescript
"use client";

import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const supabase = createClient();
  
  const handleLogin = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password });
  };
  
  return <form>...</form>;
}
```

### In API Routes
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Fetch and return data
}
```

### Using Auth Context (Optional)
```typescript
"use client";

import { useAuth } from '@/contexts/AuthContext';

export function UserProfile() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Welcome, {user.email}</div>;
}
```

## Applying Row Level Security

The RLS policies are in `supabase/migrations/001_rls_policies.sql`. To apply them:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase/migrations/001_rls_policies.sql`
4. Paste and run the SQL
5. Verify the policies are applied in **Database** → **Policies**

**What the policies do:**
- **Projects**: Users can only access their own projects
- **Forms**: Users can only access forms in their projects
- **Testimonials**: Users can only access testimonials in their projects
- **Public access**: Anonymous users can submit testimonials and view forms

## Testing Checklist

After implementation, verify:

- [ ] Unauthenticated user cannot access `/dashboard` (redirected to `/login`)
- [ ] No auth "flash" when accessing protected pages
- [ ] Authenticated user can access dashboard
- [ ] Session persists across page refreshes
- [ ] User cannot access another user's forms via API (403 Forbidden)
- [ ] User cannot update another user's data
- [ ] Landing, login, signup pages remain public
- [ ] Logout clears session and redirects to login
- [ ] Direct API calls without auth are rejected (401 Unauthorized)

## Common Patterns

### Protect a New Dashboard Page
```typescript
// src/app/dashboard/new-page/page.tsx
import { requireAuth } from '@/lib/auth/server-auth';

export default async function NewPage() {
  const user = await requireAuth(); // Auto-redirects if not authenticated
  
  return <div>Protected content for {user.email}</div>;
}
```

### Protect a New API Route
```typescript
// src/app/api/new-route/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic here
}
```

## Migration from Old Auth

If you had the old `@/lib/supabaseClient` import:

**Before:**
```typescript
import { supabase } from '@/lib/supabaseClient';
```

**After (Client Components):**
```typescript
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

**After (Server Components/API Routes):**
```typescript
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
```

## Troubleshooting

### "User is null" in Server Component
- Make sure you're using `await createClient()` from `@/lib/supabase/server`
- Check that middleware is running (refresh the page)
- Verify the user is actually logged in

### Auth Flash on Page Load
- Ensure the page is a Server Component, not Client Component
- Move auth check to server-side
- Middleware should already be protecting the route

### API Returns 401 Even When Logged In
- Check cookies are being sent with the request
- Verify `createClient()` from `@/lib/supabase/server` is being used
- Check browser console for errors

### RLS Blocking Queries
- Verify RLS policies are correctly applied
- Check that `owner_id` matches `auth.uid()`
- Test queries in Supabase SQL editor with and without RLS

## Security Best Practices

1. **Always use server-side auth for security checks**
2. **Never trust client-side auth alone**
3. **Apply RLS policies to all tables**
4. **Use middleware for route protection**
5. **Verify ownership in API routes**
6. **Use HTTPS in production**
7. **Keep Supabase keys as environment variables**
8. **Don't expose sensitive data in client components**

## Additional Resources

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

