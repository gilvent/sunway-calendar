import { useState } from 'react'
import styles from './DateRangePicker.module.scss'
import DayPickerButton from './DayPickerButton'
import { useEffect } from 'react'

function DateRangePicker() {
  const [todayTimestamp] = useState(() => {
    return Date.now()
  })
  const [selectedYear] = useState(() => {
    const date = new Date(todayTimestamp)
    return date.getFullYear()
  })
  const [selectedMonthIndex] = useState(() => {
    const date = new Date(todayTimestamp)
    return date.getMonth()
  })
  const [headerTitle, setHeaderTitle] = useState('')
  const [calendar, setCalendar] = useState([])

  useEffect(() => {
    setHeaderTitle(`${selectedYear}年 ${selectedMonthIndex + 1}月`)
  }, [selectedMonthIndex, selectedYear])

  useEffect(() => {
    const currentCalendar = generateCalendar(selectedYear, selectedMonthIndex)
    setCalendar(currentCalendar)
  }, [selectedMonthIndex, selectedYear])

  function generateCalendar(selectedYear, selectedMonthIndex) {
    const calendar = []
    const lastDateObj = new Date(selectedYear, selectedMonthIndex + 1, 0)
    const lastDate = lastDateObj.getDate()
    const lastDatePrevMonth = new Date(
      selectedYear,
      selectedMonthIndex - 1,
      0
    ).getDate()
    const firstWeekdayIndex = new Date(
      selectedYear,
      selectedMonthIndex,
      1
    ).getDay()
    const lastWeekdayIndex = lastDateObj.getDay()

    // populate previous month days
    for (let i = 0; i < firstWeekdayIndex; i++) {
      const date = lastDatePrevMonth - (firstWeekdayIndex - 1 - i)
      // TODO store Date obj here
      calendar.push({ date, transparent: true })
    }

    // current month dates
    for (let i = 1; i <= lastDate; i++) {
      // TODO store Date obj here
      calendar.push({ date: i, transparent: false })
    }

    // next month dates
    for (let i = 1; i < 7 - lastWeekdayIndex; i++) {
      // TODO store Date obj here
      calendar.push({ date: i, transparent: true })
    }

    return calendar
  }

  const pickerItems = calendar.map((item, index) => {
    return (
      <DayPickerButton key={item.day + index} transparent={item.transparent}>
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
      <div className={styles['day-picker']}>{pickerItems}</div>
    </div>
  )
}

export default DateRangePicker
