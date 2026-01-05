import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { getUserWorkoutsByDate } from '@/data/workouts'
import { DatePicker } from '@/components/dashboard/date-picker'
import { WorkoutCard } from '@/components/dashboard/workout-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Verify authentication
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get date from URL params or default to today
  const params = await searchParams
  const selectedDate = params.date ? new Date(params.date) : new Date()

  // Fetch workouts for the selected date
  const workouts = await getUserWorkoutsByDate(userId, selectedDate)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Workout Dashboard</h1>

        {/* Date Picker */}
        <div className="flex items-center gap-4 mb-6">
          <DatePicker initialDate={selectedDate} />
        </div>
      </div>

      {/* Workouts Display Area */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Workouts for {format(selectedDate, 'do MMM yyyy')}
        </h2>

        <div className="space-y-4">
          {workouts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No workouts logged</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No workouts have been logged for this date yet. Start tracking your workouts to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
