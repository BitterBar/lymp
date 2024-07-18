export type MarkerClusterNewOptions = {
  viewer?: AMap.Map
  visible?: boolean
  data?: AMap.MarkerClusterDataRow[]
  config?: Partial<AMap.MarkerClusterOptions>
}

export default class MarkerCluster extends AMap.MarkerCluster {
  viewer?: AMap.Map
  data?: AMap.MarkerClusterDataRow[]
  visible: boolean = true

  constructor(options: MarkerClusterNewOptions = {}) {
    const { viewer, data, visible, config } = options

    super(viewer, visible ? data : undefined, config)
    this.data = data
    this.visible = typeof visible === 'boolean' ? visible : true
  }

  setMap(viewer?: AMap.Map) {
    super.setMap(viewer)
    this.viewer = viewer
  }

  addData(data?: AMap.MarkerClusterDataRow[]) {
    if (this.viewer && this.visible) super.addData(data)
    this.data = this.data ? this.data.concat(data || []) : data
  }

  setData(data?: AMap.MarkerClusterDataRow[]) {
    if (this.viewer && this.visible) super.setData(data)
    this.data = data
  }

  show() {
    this.visible = true
    if (this.viewer) super.setData(this.data)
  }

  hide() {
    this.visible = false
    if (this.viewer) super.setData()
  }
}
