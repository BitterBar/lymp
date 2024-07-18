export default class LabelMarker extends AMap.LabelMarker {
  static _UID: number = 0

  _uid: number
  _type: string = 'LabelMarker'

  constructor(options: AMap.LabelMarkerOptions) {
    super(options)
    this._uid = ++LabelMarker._UID
  }
}
