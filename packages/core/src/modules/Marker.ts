export default class Marker extends AMap.Marker {
  static _UID: number = 0

  _uid: number
  _type: string = 'Marker'

  constructor(options?: AMap.MarkerOptions) {
    super(options)
    this._uid = ++Marker._UID
  }
}
