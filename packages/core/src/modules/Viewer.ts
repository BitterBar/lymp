export default class Viewer extends AMap.Map {
  static _UID: number = 0

  _uid: number
  _type: string = 'Viewer'

  constructor(container: string | HTMLDivElement, options?: AMap.MapOptions) {
    super(container, options)
    this._uid = ++Viewer._UID
  }
}
