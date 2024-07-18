import type Content from './Content'
import type LabelMarker from './LabelMarker'
import type Marker from './Marker'
import type Polygon from './Polygon'
import type Polyline from './Polyline'
import type Viewer from './Viewer'

export type OverlayGroupItem =
  | Marker
  | LabelMarker
  | Content
  | Polyline
  | Polygon

const equals = (a: OverlayGroupItem, b: OverlayGroupItem) => {
  return a._type === b._type && a._uid === b._uid
}

type OverlayGroupEventType = 'show' | 'hide'

export default class OverlayGroup extends AMap.Event<OverlayGroupEventType> {
  private _overlays: OverlayGroupItem[] = []
  private _viewer: Viewer | null = null
  private _visible: boolean = true

  constructor(overlays?: OverlayGroupItem[]) {
    super()
    this._overlays = overlays || []
  }

  addOverlay(overlay: OverlayGroupItem) {
    this._overlays.push(overlay)
    overlay[this._visible ? 'show' : 'hide']()
    if (!this._viewer) return
    this._viewer.add(overlay)
  }

  addOverlays(overlays: OverlayGroupItem[]) {
    this._overlays = this._overlays.concat(overlays)

    if (!this._viewer) return
    this._overlays.forEach(overlay => this.addOverlay(overlay))
  }

  hasOverlay(overlay: OverlayGroupItem) {
    return this._overlays.some(item => equals(item, overlay))
  }

  getOverlays() {
    return this._overlays
  }

  removeOverlay(overlay: OverlayGroupItem) {
    const index = this._overlays.findIndex(item => equals(item, overlay))
    if (index !== -1) {
      this._overlays.splice(index, 1)
    }

    if (this._viewer) {
      this._viewer.remove(overlay)
    }
  }

  removeOverlays(overlays: OverlayGroupItem[]) {
    overlays.forEach(overlay => {
      this.removeOverlay(overlay)
    })

    if (this._viewer) {
      this._viewer.remove(overlays)
    }
  }

  clearOverlays() {
    if (this._viewer) {
      this._viewer.remove(this._overlays)
    }
    this._overlays = []
  }

  show() {
    this._visible = true
    this._overlays.forEach(overlay => {
      overlay.show()
    })
    this.emit('show')
  }

  hide() {
    this._visible = false
    this._overlays.forEach(overlay => {
      overlay.hide()
    })
    this.emit('hide')
  }

  setViewer(viewer: Viewer) {
    this._viewer = viewer
    viewer.add(this._overlays)
  }
}
