import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  numeric,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - synced with Clerk
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk userId
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: text('name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

// Exercises table - library of exercises
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }), // strength, cardio, flexibility, etc.
  isCustom: boolean('is_custom').default(false).notNull(),
  createdBy: text('created_by').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('exercises_name_idx').on(table.name),
  createdByIdx: index('exercises_created_by_idx').on(table.createdBy),
  categoryIdx: index('exercises_category_idx').on(table.category),
}));

// Workouts table - individual workout sessions
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  notes: text('notes'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('workouts_user_id_idx').on(table.userId),
  dateIdx: index('workouts_date_idx').on(table.date),
  userDateIdx: index('workouts_user_date_idx').on(table.userId, table.date),
}));

// Workout Exercises - junction table with ordering
export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id, { onDelete: 'restrict' }),
  orderIndex: integer('order_index').notNull(),
  targetSets: integer('target_sets'),
  targetReps: integer('target_reps'),
  targetWeight: numeric('target_weight', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  workoutIdIdx: index('workout_exercises_workout_id_idx').on(table.workoutId),
  workoutOrderIdx: index('workout_exercises_workout_order_idx').on(table.workoutId, table.orderIndex),
  exerciseIdIdx: index('workout_exercises_exercise_id_idx').on(table.exerciseId),
}));

// Sets table - individual set records
export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weight: numeric('weight', { precision: 10, scale: 2 }),
  duration: integer('duration'), // in seconds
  distance: numeric('distance', { precision: 10, scale: 2 }), // for cardio
  isCompleted: boolean('is_completed').default(true).notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  workoutExerciseIdIdx: index('sets_workout_exercise_id_idx').on(table.workoutExerciseId),
  workoutExerciseSetIdx: index('sets_workout_exercise_set_idx').on(table.workoutExerciseId, table.setNumber),
}));

// Relations for better querying with Drizzle
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  customExercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  creator: one(users, {
    fields: [exercises.createdBy],
    references: [users.id],
  }),
  workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

// Export types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = typeof workoutExercises.$inferInsert;

export type Set = typeof sets.$inferSelect;
export type InsertSet = typeof sets.$inferInsert;
