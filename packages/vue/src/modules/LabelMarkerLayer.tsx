import {
  defineComponent,
  inject,
  type PropType,
  watchPostEffect,
  provide
} from 'vue'
import { LabelMarkerLayer } from '@lymp/core'
import {
  viewerInjectionKey,
  labelMarkerLayerInjectionKey
} from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

const props = {
  options: [Object, undefined] as PropType<AMap.LabelsLayerOptions | undefined>,
  visible: {
    type: Boolean,
    default: true
  },
  ...createLifeCycleProps<LabelMarkerLayer>()
}

export default defineComponent({
  name: 'LabelMarkerLayer',
  props,
  setup(props) {
    const labelMarkerLayer = new LabelMarkerLayer(props.options)
    const viewer = inject(viewerInjectionKey, null)
    provide(labelMarkerLayerInjectionKey, labelMarkerLayer)

    watchPostEffect(onClean => {
      if (!viewer?.value) return
      onClean(() => {
        labelMarkerLayer.clear()
        viewer.value?.remove(labelMarkerLayer)
        handleDestroyed()
      })

      viewer.value.add(labelMarkerLayer)
      handleMounted()
    })

    watchPostEffect(() => {
      labelMarkerLayer[props.visible ? 'show' : 'hide']()
    })

    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, labelMarkerLayer)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, labelMarkerLayer)
    }
  },
  render() {
    return <i>{this.$slots.default?.()}</i>
  }
})
