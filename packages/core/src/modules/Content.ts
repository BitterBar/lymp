export default class Content extends AMap.Marker {
  static _UID: number = 0

  _uid: number
  _type: string = 'Content'

  constructor(options?: AMap.OverlayOptions) {
    super(options)
    this._uid = ++Content._UID
  }
}
