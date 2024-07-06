import classNames from 'classnames'
import styles from './DayPickerButton.module.scss'

function DayPickerButton({ children, active, today, transparent }) {
  const buttonClass = classNames(
    styles['btn-day-picker'],
    getSpecialColorClass()
  )

  function getSpecialColorClass() {
    if (active) return styles['btn-day-picker--active']
    if (today) return styles['btn-day-picker--today']
    if (transparent) return styles['btn-day-picker--transparent']

    return null
  }

  return <button className={buttonClass}>{children}</button>
}

export default DayPickerButton
