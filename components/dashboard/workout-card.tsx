import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import type { Workout } from '@/src/db/schema'

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{workout.name}</span>
          {workout.isCompleted && (
            <span className="text-sm text-green-600 font-normal">✓ Completed</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {workout.startTime && (
            <div className="flex justify-between">
              <span className="font-medium">Start Time:</span>
              <span>{format(new Date(workout.startTime), 'h:mm a')}</span>
            </div>
          )}
          {workout.endTime && (
            <div className="flex justify-between">
              <span className="font-medium">End Time:</span>
              <span>{format(new Date(workout.endTime), 'h:mm a')}</span>
            </div>
          )}
          {workout.notes && (
            <div className="mt-2">
              <span className="font-medium">Notes:</span>
              <p className="text-muted-foreground mt-1">{workout.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
