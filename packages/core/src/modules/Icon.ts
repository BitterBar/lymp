export default class Icon extends AMap.Icon {
  static _UID: number = 0

  _uid: number
  _type: string = 'Icon'

  constructor(options: AMap.IconOpts) {
    super(options)
    this._uid = ++Icon._UID
  }
}
