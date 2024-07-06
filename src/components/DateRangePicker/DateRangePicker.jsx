import styles from './DateRangePicker.module.scss'
import DayPickerButton from './DayPickerButton'

function DateRangePicker() {
  return (
    <div className={styles['date-range-picker']}>
      <div className={styles.header}>
        <button className={styles['btn-prev-month']}>&#60;</button>
        <div className={styles['selected-month']}>2022年 7月</div>
        <button className={styles['btn-next-month']}>&#62;</button>
      </div>

      <div className={styles['day-picker']}>
        <DayPickerButton transparent>29日</DayPickerButton>

        <DayPickerButton transparent>30日</DayPickerButton>

        <DayPickerButton transparent>31日</DayPickerButton>

        <DayPickerButton today>1日</DayPickerButton>

        <DayPickerButton active>2日</DayPickerButton>

        <DayPickerButton active>3日</DayPickerButton>

        <DayPickerButton>4日</DayPickerButton>
      </div>
    </div>
  )
}

export default DateRangePicker
