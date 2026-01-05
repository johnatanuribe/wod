# Data Fetching

This document outlines the critical data fetching patterns and security requirements for this application.

## Core Principles

### Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

This is a non-negotiable requirement. Data fetching should NEVER be done via:
- ❌ Route handlers (API routes)
- ❌ Client components
- ❌ Client-side fetch calls
- ❌ Any other method

**✅ ONLY fetch data in Server Components**

### Why Server Components?

- **Security**: Database credentials never exposed to the client
- **Performance**: No client-side waterfalls or loading states
- **SEO**: All data rendered server-side for better indexing
- **Simplicity**: Straightforward async/await data fetching
- **Type Safety**: Full TypeScript support with no serialization issues

## Database Queries

### Data Directory Pattern

All database queries MUST be implemented as helper functions in the `/data` directory.

```typescript
// /data/workouts.ts
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

### Drizzle ORM Required

**ALWAYS use Drizzle ORM for database queries. DO NOT USE RAW SQL.**

Drizzle provides:
- Type safety
- SQL injection protection
- Consistent query patterns
- Better maintainability

```typescript
// ✅ CORRECT - Using Drizzle ORM
export async function getWorkout(workoutId: string, userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    )
    .limit(1);
}

// ❌ INCORRECT - Raw SQL
export async function getWorkout(workoutId: string, userId: string) {
  return await db.execute(`SELECT * FROM workouts WHERE id = ${workoutId}`);
}
```

## Security: User Data Isolation

### Critical Security Requirement

**A logged-in user can ONLY access their own data. They MUST NOT be able to access any other user's data.**

Every data fetching function MUST:
1. Accept a `userId` parameter
2. Filter queries by `userId`
3. Never fetch data without user verification

```typescript
// ✅ CORRECT - Always filters by userId
export async function getUserWorkout(workoutId: string, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)  // CRITICAL: Always filter by userId
      )
    )
    .limit(1);

  return workout;
}

// ❌ INCORRECT - Missing userId filter (SECURITY VULNERABILITY)
export async function getWorkout(workoutId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId))
    .limit(1);

  return workout;
}
```

### Authentication Check

Before calling any data function, always verify the user is authenticated:

```typescript
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserWorkouts } from '@/data/workouts';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const workouts = await getUserWorkouts(session.user.id);

  return (
    <div>
      {/* Render workouts */}
    </div>
  );
}
```

## Usage Pattern

### Complete Flow

1. **Create data helper in `/data` directory**
   - Use Drizzle ORM
   - Always include userId parameter
   - Always filter by userId

2. **Call from Server Component**
   - Verify authentication
   - Get userId from session
   - Pass userId to data helper

3. **Pass data to Client Components (if needed)**
   - Server Component fetches data
   - Pass as props to client components
   - Client components remain purely presentational

### Example

```typescript
// /data/workouts.ts
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.createdAt));
}

export async function getUserWorkout(workoutId: string, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    )
    .limit(1);

  return workout;
}
```

```typescript
// app/workouts/[id]/page.tsx
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getUserWorkout } from '@/data/workouts';
import { WorkoutDetails } from '@/components/workout-details';

export default async function WorkoutPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const workout = await getUserWorkout(params.id, session.user.id);

  if (!workout) {
    notFound();
  }

  return <WorkoutDetails workout={workout} />;
}
```

```typescript
// components/workout-details.tsx
'use client';

import type { Workout } from '@/db/schema';

interface WorkoutDetailsProps {
  workout: Workout;
}

export function WorkoutDetails({ workout }: WorkoutDetailsProps) {
  // Purely presentational client component
  // No data fetching happens here
  return (
    <div>
      <h1>{workout.name}</h1>
      {/* Render workout details */}
    </div>
  );
}
```

## Mutations

For data mutations (create, update, delete), use Server Actions:

```typescript
// app/workouts/actions.ts
'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteWorkout(workoutId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // CRITICAL: Verify the workout belongs to the user
  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, session.user.id)
      )
    )
    .limit(1);

  if (!workout) {
    throw new Error('Workout not found');
  }

  await db
    .delete(workouts)
    .where(eq(workouts.id, workoutId));

  revalidatePath('/dashboard');
}
```

## Summary

- ✅ **Always** fetch data in Server Components
- ✅ **Always** use helper functions in `/data` directory
- ✅ **Always** use Drizzle ORM (never raw SQL)
- ✅ **Always** filter by userId for security
- ✅ **Always** verify authentication before data access
- ❌ **Never** fetch data in client components
- ❌ **Never** fetch data in route handlers
- ❌ **Never** allow cross-user data access
