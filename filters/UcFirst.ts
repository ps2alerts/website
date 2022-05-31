import Vue from 'vue'

const ucFirst = Vue.filter('ucFirst', (value: any) => {
  const string = value.toString()
  return string[0].toUpperCase() + string.substring(1)
})

export default ucFirst
