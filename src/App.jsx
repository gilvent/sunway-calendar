import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import DateRangePicker from './components/DateRangePicker'

function App() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedRange, setSelectedRange] = useState('')

  useEffect(() => {
    if (!startDate) {
      setSelectedRange('Select a date')
      return
    }
    const startText = `${startDate.getFullYear()}年 ${startDate.getMonth() + 1}月 ${startDate.getDate()}號`

    if (!endDate) {
      setSelectedRange(startText)
      return
    }

    const endText = `${endDate.getFullYear()}年 ${endDate.getMonth() + 1}月 ${endDate.getDate()}號`

    setSelectedRange(`${startText} - ${endText}`)
  }, [startDate, endDate])

  function onDateRangeChange({ startDate, endDate }) {
    setStartDate(startDate)
    setEndDate(endDate)
  }

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <div>{selectedRange}</div>
      </div>
      <div className={styles.body}>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={onDateRangeChange}
        />
      </div>
    </div>
  )
}

export default App
