import type Viewer from './Viewer'

export type PulseLineLayerListener = (
  event: AMapEvent<Viewer>,
  feature: any
) => void
const eventsMap = new Map<PulseLineLayerListener, (e: AMapEvent) => void>()

export default class PulseLineLayer extends Loca.PulseLineLayer {
  static _UID: number = 0

  _uid: number
  _type: string = 'PulseLineLayer'

  constructor(options: Loca.PulseLineLayerOptions) {
    super(options)
    this._uid = ++PulseLineLayer._UID
  }

  on(type: AMapEventType, viewer: Viewer, callback: PulseLineLayerListener) {
    const listener = (e: AMapEvent) => {
      const target = this.queryFeature([e.pixel.x, e.pixel.y])
      if (target) callback(e, target)
    }
    eventsMap.set(callback, listener)
    viewer.on(type, listener)
  }

  off(type: AMapEventType, viewer: Viewer, callback: PulseLineLayerListener) {
    const listener = eventsMap.get(callback)
    if (listener) viewer.off(type, listener)
  }
}
