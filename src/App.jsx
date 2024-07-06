import styles from './App.module.scss'
import DateRangePicker from './components/DateRangePicker'

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <div>2024年 7月 24號 - 2024年 7月 30號 </div>
        <div>（8 天）</div>
      </div>
      <div className={styles.body}>
        <DateRangePicker></DateRangePicker>
      </div>
    </div>
  )
}

export default App
