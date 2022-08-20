// A modification of https://www.w3schools.com/howto/howto_js_countdown.asp

const timeText = (timeSeconds: number): string => {
  const time = timeSeconds * 1000

  const days = Math.floor(time / (1000 * 60 * 60 * 24))
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((time % (1000 * 60)) / 1000)

  let daysString = ''
  let hoursString
  let minutesString
  let secondsString

  if (days > 0) {
    daysString = `${days}D `
  }

  if (hours < 10) {
    hoursString = `0${hours}`
  } else {
    hoursString = hours.toString()
  }

  if (minutes < 10) {
    minutesString = `0${minutes}`
  } else {
    minutesString = minutes.toString()
  }

  if (seconds < 10) {
    secondsString = `0${seconds}`
  } else {
    secondsString = seconds.toString()
  }

  return `${daysString}${hoursString}:${minutesString}:${secondsString}`
}

export default timeText
