export default class Polygon extends AMap.Polygon {
  static _UID: number = 0

  _uid: number
  _type: string = 'Polygon'

  constructor(options?: AMap.PolygonOptions) {
    // @ts-ignore
    super(options)
    this._uid = ++Polygon._UID
  }
}
