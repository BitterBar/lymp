import type LabelMarker from './LabelMarker'

export default class LabelMarkerLayer extends AMap.LabelsLayer {
  constructor(options?: AMap.LabelsLayerOptions) {
    super(options)
  }

  add(labelMarkers: LabelMarker | LabelMarker[]) {
    // @ts-ignore
    super.add(labelMarkers)
  }

  clear() {
    // @ts-ignore
    super.clear()
  }
}
