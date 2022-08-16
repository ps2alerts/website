import Vue from 'vue'

const ordinalSuffix = Vue.filter('ordinalSuffix', (value: number) => {
  const ones = value % 10
  const tens = value % 100
  if (ones === 1 && tens !== 11) {
    return `${value}st`
  }
  if (ones === 2 && tens !== 12) {
    return `${value}nd`
  }
  if (ones === 3 && tens !== 13) {
    return `${value}rd`
  }
  return `${value}th`
})

export default ordinalSuffix
