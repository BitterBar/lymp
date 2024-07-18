import { defineComponent, inject, watchPostEffect, provide } from 'vue'
import { OverlayGroup } from '@lymp/core'
import { viewerInjectionKey, overlayGroupInjectionKey } from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

const props = {
  visible: {
    type: Boolean,
    default: true
  },
  ...createLifeCycleProps<OverlayGroup>()
}

export default defineComponent({
  name: 'OverlayGroup',
  props,
  setup(props) {
    const overlayGroup = new OverlayGroup()
    const viewer = inject(viewerInjectionKey, null)
    provide(overlayGroupInjectionKey, overlayGroup)

    watchPostEffect(onClean => {
      if (!viewer?.value) return
      onClean(() => {
        overlayGroup.clearOverlays()
        handleDestroyed()
      })

      overlayGroup.setViewer(viewer.value)
      handleMounted()
    })

    watchPostEffect(() => {
      overlayGroup[props.visible ? 'show' : 'hide']()
    })

    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, overlayGroup)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, overlayGroup)
    }
  },
  render() {
    return <i>{this.$slots.default?.()}</i>
  }
})
