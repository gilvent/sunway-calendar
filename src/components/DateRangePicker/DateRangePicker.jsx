import { useState } from 'react'
import styles from './DateRangePicker.module.scss'
import DayPickerButton from './DayPickerButton'
import { useEffect } from 'react'
import useCalendar from './useCalendar.hook'

function DateRangePicker() {
  const [headerTitle, setHeaderTitle] = useState('')
  const { currentCalendar, calendarItems, goToNextMonth, goToPrevMonth } =
    useCalendar()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    setHeaderTitle(`${currentCalendar.year}年 ${currentCalendar.month}月`)
  }, [currentCalendar])

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
        today={item.today}
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
