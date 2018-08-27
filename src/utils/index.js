export default {
  isLater (targetDate, referenceDate) {
    const targetYear = targetDate.getFullYear()
    const referenceYear = referenceDate.getFullYear()

    const targetMonth = targetDate.getMonth() + 1
    const referenceMonth = referenceDate.getMonth() + 1

    const targetDay = targetDate.getDate()
    const referenceDay = referenceDate.getDate()

    if (targetYear === referenceYear) {
      if (targetMonth === referenceMonth) {
        return targetDay > referenceDay
      } else {
        return targetMonth > referenceMonth
      }
    } else {
      return targetYear > referenceYear
    }
  }
}
