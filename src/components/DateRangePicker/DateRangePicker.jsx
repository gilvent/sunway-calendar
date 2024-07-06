import { useState } from 'react'
import styles from './DateRangePicker.module.scss'
import DayPickerButton from './DayPickerButton'
import { useEffect } from 'react'
import { useCallback } from 'react'

function DateRangePicker() {
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
  const [headerTitle, setHeaderTitle] = useState('')
  const [calendarItems, setCalendarItems] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

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
        transparent: true,
        dateObj
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
        transparent: false,
        dateObj
      })
    }

    // next month dates
    for (let i = 1; i < 7 - lastWeekdayIndex; i++) {
      const dateObj = new Date(nextCalendar.year, nextCalendar.month - 1, i)
      calendar.push({
        transparent: true,
        dateObj
      })
    }

    return calendar
  }, [currentCalendar, prevCalendar, nextCalendar])

  useEffect(() => {
    setHeaderTitle(`${currentCalendar.year}年 ${currentCalendar.month}月`)
  }, [currentCalendar])

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

  function handleClickPickerButton(dateObj) {
    if (!startDate || dateObj.valueOf() < startDate.valueOf() || endDate) {
      setStartDate(dateObj)
      setEndDate(null)
      return
    }

    setEndDate(dateObj)
  }

  function isActive(dateObj) {
    if (!startDate) return false
    const timestamp = dateObj.valueOf()

    if (!endDate) {
      return startDate.valueOf() === timestamp
    }

    return startDate.valueOf() <= timestamp && timestamp <= endDate.valueOf()
  }

  const dayPickers = calendarItems.map((item, index) => {
    const date = item.dateObj.getDate()
    const key = `${item.dateObj.getMonth()}-${date}-${index}`

    return (
      <DayPickerButton
        key={key}
        transparent={item.transparent}
        today={isToday(item.dateObj)}
        active={isActive(item.dateObj)}
        onClick={() => {
          handleClickPickerButton(item.dateObj)
        }}
      >
        {date}日
      </DayPickerButton>
    )
  })

  return (
    <div className={styles['date-range-picker']}>
      <div className={styles.header}>
        <button className={styles['btn-prev-month']} onClick={goToPrevMonth}>
          &#60;
        </button>
        <div className={styles['selected-month']}>{headerTitle}</div>
        <button className={styles['btn-next-month']} onClick={goToNextMonth}>
          &#62;
        </button>
      </div>

      {/* Most left is sunday */}
      <div className={styles['day-picker']}>{dayPickers}</div>
    </div>
  )
}

export default DateRangePicker
