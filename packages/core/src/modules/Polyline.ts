export default class Polyline extends AMap.Polyline {
  static _UID: number = 0

  _uid: number
  _type: string = 'Polyline'

  constructor(options?: AMap.PolylineOptions) {
    super(options)
    this._uid = ++Polyline._UID
  }
}
