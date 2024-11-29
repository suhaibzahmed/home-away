'use client'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'

function BookingCalendar() {
  const currentDate = new Date()
  const defaultSelected: DateRange = {
    from: undefined,
    to: undefined,
  }
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected)

  console.log(range)
  return (
    <Calendar
      id="test"
      mode="range"
      defaultMonth={currentDate}
      selected={range}
      onSelect={setRange}
    />
  )
}
export default BookingCalendar
