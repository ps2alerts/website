import { SVG, Svg } from '@svgdotjs/svg.js'
import { Point } from '~/libraries/MapWorld'
import { FacilityType, MAJOR_FACILITIES } from '~/constants/facilityType'
import { MAP_FACTION_COLORS } from '~/src/constants/FactionMapColors'
import '@svgdotjs/svg.filter.js'
import { MapRegion } from '~/libraries/MapRegion'
import facilityTypeName from '~/filters/FacilityTypeName'
import { Faction } from '~/constants/faction'
import facilityTypeShortName from '~/filters/FacilityTypeShortName'

const FONT_OPTIONS = {
  family: 'sans-serif',
  size: 60,
  anchor: 'middle',
  leading: 1.1,
}

const FACILITY_ICON_PATH = require('~/static/img/facility-icon.svg')

class LPoint {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  clone() {
    return new LPoint(this.x, this.y)
  }

  add(other: LPoint): LPoint {
    return new LPoint(this.x + other.x, this.y + other.y)
  }

  subtract(other: LPoint): LPoint {
    return new LPoint(this.x - other.x, this.y - other.y)
  }

  multiplyBy(value: number): LPoint {
    return new LPoint(value * this.x, value * this.y)
  }

  divideBy(value: number, round?: boolean): LPoint {
    if (round) {
      return new LPoint(Math.round(this.x / value), Math.round(this.y / value))
    }
    return new LPoint(this.x / value, this.y / value)
  }

  distanceTo(other: LPoint): number {
    return Math.sqrt(
      Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2)
    )
  }

  scaleBy(other: LPoint): LPoint {
    return new LPoint(this.x * other.x, this.y * other.y)
  }

  unscaleBy(other: LPoint): LPoint {
    return new LPoint(this.x / other.x, this.y / other.y)
  }

  round(): LPoint {
    return new LPoint(Math.round(this.x), Math.round(this.y))
  }

  floor(): LPoint {
    return new LPoint(Math.floor(this.x), Math.floor(this.y))
  }

  ceil(): LPoint {
    return new LPoint(Math.ceil(this.x), Math.ceil(this.y))
  }

  equals(other: LPoint): boolean {
    return this.x === other.x && this.y === other.y
  }

  contains(other: LPoint): boolean {
    return (
      Math.abs(other.x) < Math.abs(this.x) &&
      Math.abs(other.y) < Math.abs(this.y)
    )
  }

  toString(): string {
    return 'LPoint(' + this.x.toString() + ', ' + this.y.toString() + ')'
  }
}

export class FacilityBadge {
  indicatorStamp: number
  textStamp: number
  type: FacilityType
  region: MapRegion
  private svg: Svg
  private svgBuilt: boolean
  private text: Svg
  private textBuilt: boolean
  private hovered: boolean

  constructor(region: MapRegion, indictorStamp: number, textStamp: number) {
    this.indicatorStamp = indictorStamp
    this.textStamp = textStamp
    if (region.name.includes('Seapost') || region.name === 'Bathala Garden') {
      this.type = FacilityType.UNDERWATER
    } else {
      this.type = region.facilityType
    }
    this.svg = SVG()
    this.svg.viewbox(0, 0, 100, 100)
    this.text = SVG()
    this.text.viewbox(0, 0, 100, 100)
    this.svgBuilt = false
    this.textBuilt = false
    this.region = region
    this.hovered = false
  }

  divOptions() {
    return {
      html: this.getSVG() as unknown as HTMLElement,
      className: 'icon-' + facilityTypeShortName(this.type),
      iconSize: new LPoint(this.getSize().x, this.getSize().z),
      pane: 'badgePane',
    }
  }

  textDivOptions() {
    return {
      html: this.getText() as unknown as HTMLElement,
      className: 'facility-badge',
      iconSize: new LPoint(this.getTextSize().x, this.getTextSize().z),
      pane: 'badgeTextPane',
    }
  }

  private buildText(value: string): Svg {
    const matchesLength = value.match(/ /g)?.length
    switch (this.region.facilityType) {
      case FacilityType.AMP_STATION:
      case FacilityType.BIO_LAB:
      case FacilityType.TECH_PLANT:
        value = value + '\n' + facilityTypeName(this.region.facilityType)
        break
      case FacilityType.CONTAINMENT_SITE:
        value = value.replaceAll(' ', '\n')
        break
      case FacilityType.TRIDENT:
        break
      case FacilityType.INTERLINK_FACILITY:
        if (value.indexOf(' ') >= 7) {
          value = value.replace(' ', '\n')
        }
        break
      default:
        if (matchesLength !== undefined && matchesLength > 1) {
          value =
            value.slice(0, value.indexOf(' ', value.indexOf(' ') + 1)) +
            '\n' +
            value.slice(value.indexOf(' ', value.indexOf(' ') + 1) + 1)
        } else if (value.length > 16) {
          value = value.replace(' ', '\n')
        }
        if (value.indexOf('\n') > 14 && value.indexOf(' ') >= 7) {
          value = value.replace(' ', '\n')
        }
        break
    }
    this.text.viewbox(0, 0, 100, 100)
    const text = this.text.text((add) => {
      value.split('\n').forEach((substr) => {
        add.tspan(substr)
      })
    })

    const text2 = this.text.text((add) => {
      value.split('\n').forEach((substr) => {
        add.tspan(substr)
      })
    })

    text.addClass('map-region')
    text2.addClass('map-region')

    text.font(FONT_OPTIONS)
    text2.font(FONT_OPTIONS)
    text.stroke({
      color: MAP_FACTION_COLORS[this.region.faction].toString(),
      opacity: 1,
      width: 15,
    })
    text.fill(MAP_FACTION_COLORS[this.region.faction].toString())
    text.filterWith((add) => {
      add.gaussianBlur(5, 5)
    })
    const height = text.bbox().height
    text.children().forEach((tspan, index) => {
      if (index > 0) {
        tspan.dy(height * text.leading().value)
      }
      tspan.cx(0)
    })
    text2.children().forEach((tspan, index) => {
      if (index > 0) {
        tspan.dy(height * text.leading().value)
      }
      tspan.cx(0)
    })
    this.text.viewbox(
      text.bbox().x - 5,
      -text.bbox().h,
      text.bbox().w + 10,
      100 + text.bbox().h * 2 + 20
    )

    text.move(
      this.text.viewbox().cx - text.bbox().w / 2,
      this.text.viewbox().cy + 50
    )
    text2.move(
      this.text.viewbox().cx - text.bbox().w / 2,
      this.text.viewbox().cy + 50
    )
    text2.fill('white')

    this.textBuilt = true
    return this.text
  }

  update(zoom: number): void {
    if (!this.svgBuilt) {
      this.getSVG()
    }
    if (!this.textBuilt) {
      this.getText()
    }
    const newColor = MAP_FACTION_COLORS[this.region.faction].toString()
    this.svg.get(0).fill(newColor)
    if (this.visibleAtZoom(zoom)) {
      this.text
        .get(0)
        .stroke({ color: newColor, opacity: 1 })
        .fill({ color: newColor, opacity: 1 })
      this.text.show()
    } else {
      this.text.hide()
    }
  }

  setHovered(hovered: boolean, zoom: number): void {
    this.hovered = hovered
    this.update(zoom)
  }

  ready(): boolean {
    return this.svgBuilt && this.textBuilt
  }

  getSVG(): SVGSVGElement {
    if (this.svgBuilt) {
      return this.svg.node
    }

    this.svg
      .use('facility-bg', FACILITY_ICON_PATH)
      .addClass(this.region.id.toString())
      .fill(MAP_FACTION_COLORS[this.region.faction].toString())

    this.svg.use(FacilityBadge.SVGDefinitionId(this.type), FACILITY_ICON_PATH)
    this.svgBuilt = true

    return this.svg.node
  }

  getText(): SVGSVGElement {
    if (this.textBuilt) {
      return this.text.node
    }
    return this.buildText(this.region.name).node
  }

  getIcon(faction: Faction, size: number | null = null): SVGSVGElement {
    const toReturn = SVG()
    toReturn.viewbox(0, 0, 100, 100)
    toReturn
      .use('facility-bg', FACILITY_ICON_PATH)
      .fill(MAP_FACTION_COLORS[faction].toString())
    toReturn.use(FacilityBadge.SVGDefinitionId(this.type), FACILITY_ICON_PATH)
    if (size) toReturn.width(size).height(size)
    return toReturn.node
  }

  getSize(): Point {
    if (!this.svgBuilt) {
      this.getSVG()
    }
    const rad = FacilityBadge.radius(this.type)
    return new Point(
      (rad * 2 * this.svg.viewbox().width) / 100,
      (rad * 2 * this.svg.viewbox().height) / 100
    )
  }

  getTextSize(): Point {
    if (!this.textBuilt) {
      this.getText()
    }
    const rad = FacilityBadge.radius(this.type)
    return new Point(
      (rad * 2 * this.text.viewbox().width) / 100,
      (rad * 2 * this.text.viewbox().height) / 100
    )
  }

  visibleAtZoom(zoom: number) {
    if (this.hovered) {
      return true
    }
    if (MAJOR_FACILITIES.includes(this.type)) {
      return zoom >= 1
    }
    switch (this.type) {
      case FacilityType.SMALL_OUTPOST:
      case FacilityType.CONSTRUCTION_OUTPOST:
      case FacilityType.RELIC_OUTPOST:
        return zoom >= 4
      case FacilityType.LARGE_OUTPOST:
        return zoom >= 3
      default:
        return false
    }
  }

  minSize(): number {
    return FacilityBadge.radius(this.region.facilityType)
  }

  widthVW(): number {
    return FacilityBadge.radius(this.region.facilityType) * 0.04 * 2
  }

  heightVW(): number {
    return FacilityBadge.radius(this.region.facilityType) * 0.04 * 2
  }

  static radius(type: FacilityType): number {
    if (MAJOR_FACILITIES.includes(type)) {
      return 11
    }
    switch (type) {
      case FacilityType.SMALL_OUTPOST:
      case FacilityType.CONSTRUCTION_OUTPOST:
        return 9
      case FacilityType.LARGE_OUTPOST:
        return 10
      default:
        return 0
    }
  }

  static SVGDefinitionId(type: FacilityType): string {
    switch (type) {
      case FacilityType.AMP_STATION:
        return 'amp-fg'
      case FacilityType.BIO_LAB:
        return 'bio-fg'
      case FacilityType.TECH_PLANT:
        return 'tech-fg'
      case FacilityType.LARGE_OUTPOST:
        return 'lg-outpost-fg'
      case FacilityType.SMALL_OUTPOST:
        return 'sm-outpost-fg'
      case FacilityType.WARPGATE:
        return 'warpgate-fg'
      case FacilityType.INTERLINK_FACILITY:
        return 'interlink-fg'
      case FacilityType.CONSTRUCTION_OUTPOST:
        return 'const-outpost-fg'
      case FacilityType.RELIC_OUTPOST:
        return 'relic-fg'
      case FacilityType.CONTAINMENT_SITE:
        return 'containment-fg'
      case FacilityType.TRIDENT:
        return 'trident-fg'
      case FacilityType.UNDERWATER:
        return 'seapost-fg'
      default:
        return ''
    }
  }
}
