import { Control, DomUtil } from 'leaflet'

export const ZoomCenter = Control.Zoom.extend({
  options: {
    zoomCenterText: '<i class="fa-solid fa-arrows-to-dot"></i>',
    zoomCenterTitle: 'Center View',
    zoomCenterLevel: 2,
  },

  _zoomInButton: undefined,
  _zoomOutButton: undefined,
  _zoomCenterButton: undefined,

  onAdd(map) {
    const zoomName = 'leaflet-control-zoom'
    const container = DomUtil.create('div', zoomName + ' leaflet-bar')
    const options = this.options

    this._zoomInButton = this._createButton(
      options.zoomInText,
      options.zoomInTitle,
      zoomName + '-in',
      container,
      this._zoomIn
    )
    this._zoomOutButton = this._createButton(
      options.zoomOutText,
      options.zoomOutTitle,
      zoomName + '-out',
      container,
      this._zoomOut
    )
    this._zoomCenterButton = this._createButton(
      options.zoomCenterText,
      options.zoomCenterTitle,
      zoomName + '-center',
      container,
      this._zoomCenter
    )

    this._updateDisabled()
    map.on('zoomend zoomlevelschange', this._updateDisabled, this)

    return container
  },

  onRemove(map) {
    map.off('zoomend zoomlevelschange', this._updateDisabled, this)
  },

  _zoomCenter(_) {
    if (!this._disabled) {
      this._map.setView([-128, 128], this.options.zoomCenterLevel)
    }
  },
})
