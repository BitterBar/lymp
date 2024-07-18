import { defineComponent, inject, type PropType, watch, onUnmounted } from 'vue'
import { MarkerCluster } from '@lymp/core'
import { viewerInjectionKey } from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

export type MarkerClusterClickEvent = {
  lnglat: AMap.LngLat
  marker: AMap.Marker
  target: MarkerCluster
}

export type MarkerClusterOptions =
  | Partial<
      Exclude<AMap.MarkerClusterOptions, 'renderClusterMarker' | 'renderMarker'>
    >
  | undefined

const props = {
  visible: {
    type: Boolean,
    default: true
  },
  data: [Array, undefined] as PropType<AMap.MarkerClusterDataRow[] | undefined>,
  options: [Object, undefined] as PropType<MarkerClusterOptions>,
  renderClusterMarker: [Function, undefined] as PropType<
    AMap.RenderClusterMarker | undefined
  >,
  renderMarker: [Function, undefined] as PropType<
    AMap.RenderMarker | undefined
  >,
  onClick: [Function, undefined] as PropType<
    (e: MarkerClusterClickEvent) => void
  >,
  ...createLifeCycleProps<MarkerCluster>()
}

export default defineComponent({
  name: 'MarkerCluster',
  props,
  setup(props) {
    const cluster = new MarkerCluster({
      visible: props.visible,
      data: props.data,
      config: {
        ...(props.options || {}),
        renderClusterMarker: props.renderClusterMarker,
        renderMarker: props.renderMarker
      }
    })
    cluster.on('click', e => props.onClick?.(e))
    watch(
      () => props.visible,
      visible => {
        if (visible) cluster.show()
        else cluster.hide()
      }
    )
    watch(
      () => props.data,
      data => {
        cluster.setData(data)
      }
    )

    const viewer = inject(viewerInjectionKey, null)
    const unwatch = watch(
      () => viewer?.value,
      v => {
        if (!v) return
        cluster.setMap(v)
        handleMounted()
        unwatch()
      }
    )

    onUnmounted(() => {
      cluster.setMap()
      handleDestroyed()
    })

    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, cluster)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, cluster)
    }
  },
  render() {
    return <i />
  }
})
