import { defineComponent, inject, type PropType, watchPostEffect } from 'vue'
import { Polyline } from '@lymp/core'
import { overlayGroupInjectionKey, viewerInjectionKey } from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

const props = {
  options: [Object, undefined] as PropType<AMap.PolylineOptions | undefined>,
  ...createLifeCycleProps<Polyline>()
}

export default defineComponent({
  name: 'Polyline',
  props,
  setup(props) {
    const polyline = new Polyline(props.options)
    const viewer = inject(viewerInjectionKey, null)

    const overlayGroup = inject(overlayGroupInjectionKey, null)
    if (overlayGroup) return overlayGroup.addOverlay(polyline)

    watchPostEffect(onClean => {
      if (!viewer?.value) return
      onClean(() => {
        viewer?.value?.remove(polyline)
        handleDestroyed()
      })

      viewer.value.add(polyline)
      handleMounted()
    })

    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, polyline)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, polyline)
    }
  },
  render() {
    return <i />
  }
})
