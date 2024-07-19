import {
  defineComponent,
  inject,
  type PropType,
  watchPostEffect,
  provide,
  shallowRef
} from 'vue'
import { type Content, LabelMarker } from '@lymp/core'
import {
  overlayGroupInjectionKey,
  setContentInjectionKey,
  viewerInjectionKey,
  labelMarkerLayerInjectionKey
} from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

const props = {
  ...createLifeCycleProps<LabelMarker>()
}

export default defineComponent({
  name: 'LabelMarker',
  props: {
    ...props,
    trigger: {
      type: String as PropType<AMapEventType>,
      default: 'click'
    },
    options: {
      type: Object as PropType<AMap.LabelMarkerOptions>,
      required: true
    }
  },
  setup(props) {
    const labelMaker = new LabelMarker(props.options)
    const viewer = inject(viewerInjectionKey, null)
    const overlayGroup = inject(overlayGroupInjectionKey, null)
    const labelMarkerLayer = inject(labelMarkerLayerInjectionKey, null)

    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, labelMaker)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, labelMaker)
    }

    // #S slot: content
    const content = shallowRef<Content | null>(null)
    provide(setContentInjectionKey, c => {
      content.value = c
    })
    watchPostEffect(onClean => {
      if (!content.value) return
      if (!content.value.getMap()) {
        watchPostEffect(() => {
          if (!viewer?.value || !content.value) return
          content.value.setMap(viewer.value)
        })
      }
      const handleToggle = () => {
        if (!content.value) return
        content.value[content.value.getVisible() ? 'hide' : 'show']()
      }

      onClean(() => {
        labelMaker.off(props.trigger, handleToggle)
        if (props.trigger === 'mouseover')
          labelMaker.off('mouseout', handleToggle)
        handleDestroyed()
      })

      labelMaker.on(props.trigger, handleToggle)
      if (props.trigger === 'mouseover') labelMaker.on('mouseout', handleToggle)

      if (!overlayGroup) return
      overlayGroup.on('hide', () => content.value?.hide()) // TODO: content可能会从地图中删除！WARN
    })
    // #E slot: content

    // #S slot: labelMarkerLayer
    if (labelMarkerLayer) {
      labelMarkerLayer.add(labelMaker)
      handleMounted()
      return {
        labelMarkerLayer
      }
    }
    // #E slot: labelMarkerLayer

    if (overlayGroup) {
      overlayGroup.addOverlay(labelMaker)
      handleMounted()
      return {
        labelMarkerLayer
      }
    }

    watchPostEffect(onClean => {
      onClean(() => {
        viewer?.value?.remove(labelMaker)
        handleDestroyed()
      })

      if (!viewer?.value) return
      viewer.value.add(labelMaker)
      handleMounted()
    })

    return {
      labelMarkerLayer
    }
  },
  render() {
    // 作为labelMarkerLayer子元素时不渲染content，不然会出现渲染大量dom元素时卡顿
    return <i>{this.labelMarkerLayer ? null : this.$slots.content?.()}</i>
  }
})
