import { db } from '@/src/db';
import { workouts, workoutExercises, exercises, sets } from '@/src/db/schema';
import { eq, and, gte, lt, desc } from 'drizzle-orm';

/**
 * Get all workouts for a user on a specific date
 * SECURITY: Always filters by userId to ensure data isolation
 */
export async function getUserWorkoutsByDate(userId: string, date: Date) {
  // Create date range for the selected day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.date, startOfDay),
        lt(workouts.date, endOfDay)
      )
    )
    .orderBy(desc(workouts.date));

  return userWorkouts;
}

/**
 * Get a single workout with all its exercises and sets
 * SECURITY: Always filters by userId to ensure the workout belongs to the user
 */
export async function getUserWorkoutDetails(workoutId: number, userId: string) {
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

  if (!workout) {
    return null;
  }

  // Get workout exercises with their exercise details and sets
  const workoutExercisesList = await db
    .select({
      id: workoutExercises.id,
      orderIndex: workoutExercises.orderIndex,
      targetSets: workoutExercises.targetSets,
      targetReps: workoutExercises.targetReps,
      targetWeight: workoutExercises.targetWeight,
      exercise: {
        id: exercises.id,
        name: exercises.name,
        category: exercises.category,
      },
      sets: sets,
    })
    .from(workoutExercises)
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(eq(workoutExercises.workoutId, workoutId))
    .orderBy(workoutExercises.orderIndex);

  // Group sets by workout exercise
  const exercisesMap = new Map();

  for (const row of workoutExercisesList) {
    const exerciseKey = row.id;

    if (!exercisesMap.has(exerciseKey)) {
      exercisesMap.set(exerciseKey, {
        id: row.id,
        orderIndex: row.orderIndex,
        targetSets: row.targetSets,
        targetReps: row.targetReps,
        targetWeight: row.targetWeight,
        exercise: row.exercise,
        sets: [],
      });
    }

    if (row.sets) {
      exercisesMap.get(exerciseKey).sets.push(row.sets);
    }
  }

  return {
    ...workout,
    exercises: Array.from(exercisesMap.values()),
  };
}

/**
 * Get all workouts for a user (most recent first)
 * SECURITY: Always filters by userId
 */
export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.createdAt));
}
