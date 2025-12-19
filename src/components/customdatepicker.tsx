"use client"

import * as React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface CustomDatePickerProps {
  date: Date
  onDateChange: (date: Date) => void
  className?: string
}

export function CustomDatePicker({ date, onDateChange, className }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(date.getFullYear(), date.getMonth(), 1))

  // Days of the week in correct order (starting with Sunday)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)

    // Adjust to start from Sunday (0 = Sunday)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  const handleDateSelect = (selectedDate: Date) => {
    onDateChange(selectedDate)
    setIsOpen(false)
  }

  const isSelectedDate = (checkDate: Date) => checkDate.toDateString() === date.toDateString()
  const isToday = (checkDate: Date) => checkDate.toDateString() === new Date().toDateString()
  const isCurrentMonth = (checkDate: Date) => checkDate.getMonth() === currentMonth.getMonth()

  const days = getDaysInMonth(currentMonth)

  return (
    <div className={cn("relative", className)}>
      {/* Date Input Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formatDisplayDate(date)}
      </Button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-80 rounded-md border bg-white shadow-lg dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <Button type="button" variant="ghost" size="sm" onClick={goToPreviousMonth} className="h-7 w-7 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={goToNextMonth} className="h-7 w-7 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="p-3">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "h-8 w-8 text-sm rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
                    {
                      "text-gray-400 dark:text-gray-600": !isCurrentMonth(day),
                      "bg-blue-500 text-white hover:bg-blue-600": isSelectedDate(day),
                      "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300": isToday(day) && !isSelectedDate(day),
                      "font-medium": isCurrentMonth(day),
                    }
                  )}
                >
                  {day.getDate()}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t p-3 flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => handleDateSelect(new Date())} className="text-xs">
              Today
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} className="text-xs ml-auto">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Overlay to close calendar when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

interface CustomDateRangeDropdownProps {
  dateRange: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  className?: string
}

export function CustomDateRangeDropdown({ dateRange, onChange, className }: CustomDateRangeDropdownProps) {
  const [open, setOpen] = useState(false)

  const formatPart = (date?: Date) => (date ? format(date, "dd MMM yyyy") : "Select")
  const label = `${formatPart(dateRange?.from)} – ${formatPart(dateRange?.to)}`

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        className="h-10 px-5 shadow-sm w-full sm:w-auto sm:min-w-[180px] justify-start text-left font-normal bg-zinc-900/80 border-zinc-700/60 hover:bg-zinc-800/80 hover:border-zinc-600"
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {label}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[640px]">
          <CustomDateRangePanel
            dateRange={dateRange}
            onChange={(r) => {
              onChange(r)
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  )
}

interface CustomDateRangeInlineProps {
  dateRange: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  className?: string
}

export function CustomDateRangeInline({ dateRange, onChange, className }: CustomDateRangeInlineProps) {
  return (
    <div className={cn("rounded-lg border border-zinc-700/60 bg-zinc-900/50 p-2", className)}>
      <div className="grid grid-cols-2 gap-3 min-w-[360px]">
        <CustomDatePicker
          date={dateRange?.from || new Date()}
          onDateChange={(d) => onChange({ from: d, to: dateRange?.to || d })}
        />
        <CustomDatePicker
          date={dateRange?.to || new Date()}
          onDateChange={(d) => onChange({ from: dateRange?.from || d, to: d })}
        />
      </div>
    </div>
  )
}

// Compact two-month range panel (from–to) in a single box, preserving each month grid structure
interface CustomDateRangePanelProps {
  dateRange: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  onCancel?: () => void
  className?: string
}

export function CustomDateRangePanel({ dateRange, onChange, onCancel, className }: CustomDateRangePanelProps) {
  const [localRange, setLocalRange] = useState<DateRange | undefined>(dateRange)
  const [leftMonth, setLeftMonth] = useState<Date>(new Date(localRange?.from || new Date()))
  const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)

  const buildMonth = (monthDate: Date) => {
    const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
    const start = new Date(first)
    start.setDate(start.getDate() - first.getDay())
    const days: Date[] = []
    const d = new Date(start)
    for (let i = 0; i < 42; i++) { days.push(new Date(d)); d.setDate(d.getDate() + 1) }
    return days
  }

  const isSameDay = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString()
  const isInRange = (day: Date) => localRange?.from && localRange?.to && day >= normalize(localRange.from) && day <= normalize(localRange.to)
  const normalize = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  const isCurrentMonth = (day: Date, monthDate: Date) => day.getMonth() === monthDate.getMonth()

  const selectDay = (day: Date) => {
    if (!localRange?.from || (localRange.from && localRange.to)) {
      setLocalRange({ from: day, to: undefined })
    } else if (localRange.from && !localRange.to) {
      const from = normalize(localRange.from)
      const to = normalize(day)
      setLocalRange(from <= to ? { from, to } : { from: to, to: from })
    }
  }

  const Month = ({ monthDate, label }: { monthDate: Date; label: string }) => {
    const days = buildMonth(monthDate)
    return (
      <div className="w-80">
        <div className="flex items-center justify-between p-3">
          <div className="text-sm font-medium">{label}</div>
        </div>
        <div className="px-3">
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 p-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectDay(day)}
                className={cn(
                  "h-8 w-8 text-sm rounded-md transition-colors",
                  {
                    "text-gray-400 dark:text-gray-600": !isCurrentMonth(day, monthDate),
                    "bg-indigo-500 text-white": isInRange(day) || isSameDay(day, localRange?.from) || isSameDay(day, localRange?.to),
                    "hover:bg-gray-100 dark:hover:bg-gray-700": true,
                  }
                )}
              >
                {day.getDate()}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-4 text-zinc-50", className)}>
      <div className="flex items-center justify-between px-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1))} className="h-7 w-7 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1))} className="h-7 w-7 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-8">
        <Month monthDate={new Date(leftMonth.getFullYear(), leftMonth.getMonth(), 1)} label={leftMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })} />
        <Month monthDate={rightMonth} label={rightMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })} />
      </div>
      <div className="mt-4 text-[12px] text-zinc-400 border-t border-zinc-700/60 pt-3">
        This section only displays records from the last 45 days. For earlier data, please download a report from the Reports section.
      </div>
      <div className="mt-3 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onCancel} className="h-9 px-4">Cancel</Button>
        <Button onClick={() => onChange(localRange)} className="h-9 px-4">Apply</Button>
      </div>
    </div>
  )
} 