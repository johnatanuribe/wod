'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'

interface DatePickerProps {
  initialDate: Date
}

export function DatePicker({ initialDate }: DatePickerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate)

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return

    setSelectedDate(date)

    // Update URL with new date (using simple date format)
    const params = new URLSearchParams(searchParams)
    params.set('date', format(date, 'yyyy-MM-dd'))
    router.push(`?${params.toString()}`)

    // Force server re-render to fetch new data
    router.refresh()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-64 justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedDate, 'do MMM yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
