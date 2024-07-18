declare global {
  interface Window {
    Loca: typeof Loca
  }

  export type AMapEventType =
    | 'resize'
    | 'complete'
    | 'click'
    | 'dblclick'
    | 'mapmove'
    | 'hotspotclick'
    | 'hotspotover'
    | 'hotspotout'
    | 'movestart'
    | 'moveend'
    | 'zoomchange'
    | 'zoomstart'
    | 'zoomend'
    | 'rotatechange'
    | 'rotatestart'
    | 'rotatestart'
    | 'mousemove'
    | 'mousewheel'
    | 'mouseover'
    | 'mouseout'
    | 'mouseup'
    | 'mousedown'
    | 'rightclick'
    | 'dragstart'
    | 'dragging'
    | 'dragend'
    | 'touchstart'
    | 'touchmove'
    | 'touchend'

  export type AMapEvent<T = any> = {
    lnglat: AMap.LngLat
    pixel: AMap.Pixel
    type: AMapEventType
    target: T
    pos: AMap.Vector2
    originalEvent: MouseEvent
  }

  namespace Loca {
    class Layer {
      new(options: LayerOptions): Layer
      constructor(options: LayerOptions)

      setLoca(loca: Loca.Container): void
      setOpacity(opacity: number): void
      setzIndex(zIndex: number): void
      setZooms(zIndex: number): void
      show(duration?: number, callback?: Function): void
      hide(duration?: number, callback?: Function): void
      remove(): void
      destroy(): void
      queryFeature(pos: [number, number]): any
      addAnimate(config: AnimateOptions, callback?: Function): void
      setSource(source: GeoJSONSource): void
    }
    interface LayerOptions {
      loca?: Loca.Container
      zIndex?: number
      visible?: boolean
      zooms?: [number, number]
      opacity?: number
    }

    class Animate {
      new(options: AnimateOptions): Animate
      constructor(options: AnimateOptions)

      start(): void
      stop(): void
      pause(): void
    }
    export type AnimateOptions = {
      key?: string
      value?: number[]
      duration?: number
      easing?: string
      startAt?: number
      yoyo?: boolean
      random?: boolean
      delay?: number
      transform?: number
    }

    export class Container {
      new(options: ContainerOptions): Container
      constructor(options: ContainerOptions)

      animate: Animate
      add(layer: Layer): void
      remove(layer: Layer): void
      destroy(): void
    }
    export type ContainerOptions = {
      map: AMap.Map
    }

    export class GeoJSONSource {
      new(options?: GeoJSONSourceOptions): GeoJSONSource
      constructor(options?: GeoJSONSourceOptions)

      destroy(): void
    }
    export type GeoJSONSourceOptions = {
      data?: any
      url?: string
    }

    export class PulseLineLayer extends Layer {
      new(options?: PulseLineLayerOptions): PulseLineLayer
      constructor(options?: PulseLineLayerOptions)

      map?: AMap.Map

      setStyle(style: PulseLineStyle): void
    }
    export type PulseLineLayerOptions = Exclude<LayerOptions, 'loca'>
    export type PulseLineStyle = {
      lineWidth?: number | Function
      headColor?: string | Function
      trailColor?: string | Function
      altitude?: number
      interval?: number
      duration?: number
    }
  }
}

export {}
