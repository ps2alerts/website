import Vue from 'vue'

// https://gist.github.com/g1eb/62d9a48164fe7336fdf4845e22ae3d2c
const secondsInHumanTime = Vue.filter(
  'secondsInHumanTime',
  (string: string) => {
    let seconds = parseInt(string, 10)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - hours * 3600) / 60)
    seconds = seconds - hours * 3600 - minutes * 60

    let secondsString = seconds.toString()
    if (seconds < 10) {
      secondsString = `0${seconds}`
    }
    let minutesString = minutes.toString()
    if (minutes < 10) {
      minutesString = `0${minutes}`
    }

    if (hours) {
      if (minutes) {
        return `${hours}:${minutesString}:${secondsString}`
      } else {
        return `${hours}:00:${secondsString}`
      }
    }
    if (minutes) {
      return `0:${minutesString}:${secondsString}`
    }
    return `0:00:${secondsString}`
  }
)

export default secondsInHumanTime
