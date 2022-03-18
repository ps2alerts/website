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

const NS = Color.fromString('#71809666') as Color
const VS = Color.fromString('#6E18A366') as Color
const NC = Color.fromString('#0064AA66') as Color
const TR = Color.fromString('#BC121266') as Color

const VSCutoff = Color.fromString('#2E153D66') as Color
const NCCutoff = Color.fromString('#0F273F66') as Color
const TRCutoff = Color.fromString('#3A000566') as Color

const NSLink = Color.fromString('#928E9966') as Color
const VSLink = Color.fromString('#FFB2FFCC') as Color
const NCLink = Color.fromString('#B0FFFFCC') as Color
const TRLink = Color.fromString('#FFBFB2CC') as Color
const ASSAULTABLELink = Color.fromString('#EAE690CC') as Color
const ASSAULTABLELinkBg = Color.fromString('#8B7251CC') as Color
const NSLinkBg = Color.fromString('#49474C66') as Color

export const MAP_FACTION_COLORS = [NS, VS, NC, TR, NS]

export const MAP_CUTOFF_COLORS = [NS, VSCutoff, NCCutoff, TRCutoff, NS]

export const MAP_LINK_COLORS = [
  NSLink,
  VSLink,
  NCLink,
  TRLink,
  ASSAULTABLELink,
  ASSAULTABLELinkBg,
  NSLinkBg,
]
