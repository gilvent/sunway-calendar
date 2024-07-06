import { useState } from 'react'
import styles from './DateRangePicker.module.scss'
import DayPickerButton from './DayPickerButton'
import { useEffect } from 'react'
import { useCallback } from 'react'
import useEffectOnChange from '../../hooks/useEffectOnChange.hook'

function DateRangePicker() {
  const [todayTimestamp] = useState(() => {
    return Date.now()
  })
  const [currentCalendar] = useState(() => {
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
  const [headerTitle, setHeaderTitle] = useState('')
  const [calendarItems, setCalendarItems] = useState([])

  const generateCalendar = useCallback(
    (year, month) => {
      const calendar = []
      const selectedMonthIndex = month - 1
      const lastDateObj = new Date(year, selectedMonthIndex + 1, 0)
      const lastDate = lastDateObj.getDate()
      const lastDatePrevMonth = new Date(
        year,
        selectedMonthIndex - 1,
        0
      ).getDate()
      const firstWeekdayIndex = new Date(year, selectedMonthIndex, 1).getDay()
      const lastWeekdayIndex = lastDateObj.getDay()

      // populate previous month days
      for (let i = 0; i < firstWeekdayIndex; i++) {
        const date = lastDatePrevMonth - (firstWeekdayIndex - 1 - i)
        const dateObj = new Date(
          prevCalendar.year,
          prevCalendar.month - 1,
          date
        )

        calendar.push({
          date,
          transparent: true,
          dateObj,
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
          date: i,
          transparent: false,
          dateObj,
          today: isToday(dateObj)
        })
      }

      // next month dates
      for (let i = 1; i < 7 - lastWeekdayIndex; i++) {
        const dateObj = new Date(nextCalendar.year, nextCalendar.month - 1, i)
        calendar.push({
          date: i,
          transparent: true,
          dateObj,
          isToday: isToday(dateObj)
        })
      }

      return calendar
    },
    [currentCalendar, prevCalendar, nextCalendar]
  )

  useEffect(() => {
    setHeaderTitle(`${currentCalendar.year}年 ${currentCalendar.month}月`)
  }, [currentCalendar])

  useEffectOnChange(() => {
    const { year, month } = currentCalendar
    setPrevCalendar(getPrevCalendar(year, month))
    setNextCalendar(getNextCalendar(year, month))
  }, [currentCalendar])

  useEffect(() => {
    const items = generateCalendar(currentCalendar.year, currentCalendar.month)
    setCalendarItems(items)
  }, [currentCalendar])

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

  const dayPickers = calendarItems.map((item, index) => {
    return (
      <DayPickerButton
        key={item.date + index}
        transparent={item.transparent}
        today={item.today}
      >
        {item.date}日
      </DayPickerButton>
    )
  })

  return (
    <div className={styles['date-range-picker']}>
      <div className={styles.header}>
        <button className={styles['btn-prev-month']}>&#60;</button>
        <div className={styles['selected-month']}>{headerTitle}</div>
        <button className={styles['btn-next-month']}>&#62;</button>
      </div>

      {/* Most left is sunday */}
      <div className={styles['day-picker']}>{dayPickers}</div>
    </div>
  )
}

export default DateRangePicker
