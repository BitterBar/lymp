import { defineComponent, inject, type PropType, watchPostEffect } from 'vue'
import { Marker } from '@lymp/core'
import { overlayGroupInjectionKey, viewerInjectionKey } from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

const props = {
  options: [Object, undefined] as PropType<AMap.MarkerOptions | undefined>,
  ...createLifeCycleProps<Marker>()
}

export default defineComponent({
  name: 'Marker',
  props,
  setup(props) {
    const marker = new Marker(props.options)
    const viewer = inject(viewerInjectionKey, null)

    const overlayGroup = inject(overlayGroupInjectionKey, null)
    if (overlayGroup) return overlayGroup.addOverlay(marker)

    watchPostEffect(onClean => {
      if (!viewer?.value) return
      onClean(() => {
        viewer?.value?.remove(marker)
        handleDestroyed()
      })

      viewer.value.add(marker)
      handleMounted()
    })

    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, marker)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, marker)
    }
  },
  render() {
    return <i />
  }
})
