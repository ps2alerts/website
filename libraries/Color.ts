export class Color {
  r: number
  g: number
  b: number
  a: number
  arr: number[]
  constructor(r: number, g: number, b: number, a: number) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
    this.arr = [r, g, b]
  }

  toString(): string {
    let toReturn = '#'
    this.arr.forEach((val) => {
      val = Math.round(val * 255)
      if (val < 16) {
        toReturn += '0'
      }
      toReturn += val.toString(16)
    })
    return toReturn
  }

  static fromString(colorStr: string): Color | undefined {
    if (colorStr.length < 7 || colorStr[0] !== '#') {
      return undefined
    }
    const r = parseInt(colorStr.slice(1, 3), 16)
    const g = parseInt(colorStr.slice(3, 5), 16)
    const b = parseInt(colorStr.slice(5, 7), 16)
    let a = 255
    if (colorStr.length > 7) {
      a = parseInt(colorStr.slice(7, 9), 16)
    }
    return new Color(r / 255, g / 255, b / 255, a / 255)
  }
}
