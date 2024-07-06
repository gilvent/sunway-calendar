import { useCallback, useEffect, useState } from 'react'

export default function useCalendar() {
  const [todayTimestamp] = useState(() => {
    return Date.now()
  })
  const [currentCalendar, setCurrentCalendar] = useState(() => {
    const todayDateObj = new Date(todayTimestamp)
    return {
      year: todayDateObj.getFullYear(),
      month: todayDateObj.getMonth() + 1
    }
  })
  const [prevCalendar, setPrevCalendar] = useState(() =>
    getPrevCalendar(currentCalendar.year, currentCalendar.month)
  )
  const [nextCalendar, setNextCalendar] = useState(() =>
    getNextCalendar(currentCalendar.year, currentCalendar.month)
  )
  const [calendarItems, setCalendarItems] = useState([])

  const generateCalendar = useCallback(() => {
    const calendar = []
    const selectedMonthIndex = currentCalendar.month - 1
    const lastDateObj = new Date(
      currentCalendar.year,
      selectedMonthIndex + 1,
      0
    )
    const lastDate = lastDateObj.getDate()
    const lastDatePrevMonth = new Date(
      currentCalendar.year,
      selectedMonthIndex,
      0
    ).getDate()
    const firstWeekdayIndex = new Date(
      currentCalendar.year,
      selectedMonthIndex,
      1
    ).getDay()
    const lastWeekdayIndex = lastDateObj.getDay()

    // populate previous month days
    for (let i = 0; i < firstWeekdayIndex; i++) {
      const date = lastDatePrevMonth - (firstWeekdayIndex - 1 - i)
      const dateObj = new Date(prevCalendar.year, prevCalendar.month - 1, date)

      calendar.push({
        dateObj,
        transparent: true,
        today: isToday(dateObj)
      })
    }

    // current month dates
    for (let i = 1; i <= lastDate; i++) {
      const dateObj = new Date(
        currentCalendar.year,
        currentCalendar.month - 1,
        i
      )

      calendar.push({
        dateObj,
        transparent: false,
        today: isToday(dateObj)
      })
    }

    // next month dates
    for (let i = 1; i < 7 - lastWeekdayIndex; i++) {
      const dateObj = new Date(nextCalendar.year, nextCalendar.month - 1, i)
      calendar.push({
        dateObj,
        transparent: true,
        today: isToday(dateObj)
      })
    }

    return calendar
  }, [currentCalendar, prevCalendar, nextCalendar])

  useEffect(() => {
    const items = generateCalendar()
    setCalendarItems(items)
  }, [generateCalendar])

  function getPrevCalendar(currentYear, currentMonth) {
    if (currentMonth === 0) {
      return {
        year: currentYear - 1,
        month: 12
      }
    }

    return {
      year: currentYear,
      month: currentMonth - 1
    }
  }

  function getNextCalendar(currentYear, currentMonth) {
    if (currentMonth === 12) {
      return {
        year: currentYear + 1,
        month: 1
      }
    }

    return {
      year: currentYear,
      month: currentMonth + 1
    }
  }

  function isToday(dateObj) {
    const nextDay = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate() + 1
    )

    return (
      dateObj.valueOf() <= todayTimestamp && todayTimestamp < nextDay.valueOf()
    )
  }

  function goToPrevMonth() {
    setNextCalendar(currentCalendar)
    setCurrentCalendar(prevCalendar)
    setPrevCalendar(getPrevCalendar(prevCalendar.year, prevCalendar.month))
  }

  function goToNextMonth() {
    setPrevCalendar(currentCalendar)
    setCurrentCalendar(nextCalendar)
    setNextCalendar(getNextCalendar(nextCalendar.year, nextCalendar.month))
  }

  return {
    calendarItems,
    currentCalendar,
    goToPrevMonth,
    goToNextMonth,
    isToday
  }
}
