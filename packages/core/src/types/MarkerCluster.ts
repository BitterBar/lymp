declare global {
  namespace AMap {
    export class GeoJSON {
      new(options: any): GeoJSON
      constructor(options: any)
    }

    export class MarkerCluster extends AMap.Event<'click'> {
      new(
        viewer?: AMap.Map,
        data?: MarkerClusterDataRow[],
        options?: Partial<MarkerClusterOptions>
      ): MarkerCluster
      constructor(
        viewer?: AMap.Map,
        data?: MarkerClusterDataRow[],
        options?: Partial<MarkerClusterOptions>
      )

      setMap(viewer?: AMap.Map): void
      getMap(): AMap.Map | undefined

      setData(data?: MarkerClusterDataRow[]): void
      addData(data?: MarkerClusterDataRow[]): void
    }

    export interface MarkerClusterDataRow {
      lnglat: AMap.LngLat | AMap.Vector2
      weight: number
    }

    export type RenderClusterMarker = (context: {
      count: number
      marker: AMap.Marker
    }) => void
    export type RenderMarker = (context: { marker: AMap.Marker }) => void

    export interface MarkerClusterOptions {
      gridSize: number
      maxZoom: number
      averageCenter: boolean
      clusterByZoomChange: boolean
      renderClusterMarker: RenderClusterMarker
      renderMarker: RenderMarker
    }
  }
}

export {}
