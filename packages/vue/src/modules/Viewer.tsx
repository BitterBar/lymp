import {
  defineComponent,
  shallowRef,
  type PropType,
  onMounted,
  onUnmounted,
  provide,
  renderSlot
} from 'vue'
import { Viewer } from '@lymp/core'
import style from '../styles/viewer.cssr'
import { namespace } from '../utils/cssr'
import { viewerInjectionKey } from '../injectionKeys'
import { call } from '../utils/vue/call'
import createLifeCycleProps from '../props/createLifeCycleProps'

const props = {
  options: Object as PropType<AMap.MapOptions | undefined>,
  ...createLifeCycleProps<Viewer>()
}

export default defineComponent({
  name: 'Viewer',
  props,
  setup(props) {
    const handleMounted = () => {
      if (!props.onMounted) return
      call(props.onMounted, viewer.value!)
    }
    const handleDestroyed = () => {
      if (!props.onDestroyed) return
      call(props.onDestroyed, viewer.value!)
    }

    const viewer = shallowRef<Viewer | null>(null)
    const viewerContainer = shallowRef<HTMLDivElement | null>(null)
    provide(viewerInjectionKey, viewer)

    onMounted(() => {
      if (!viewerContainer.value) return
      style.mount({ id: 'viewerContainer' })
      viewer.value = new Viewer(viewerContainer.value, props.options)
      viewer.value.on('complete', () => handleMounted())
    })

    onUnmounted(() => {
      if (!viewer.value) return
      viewer.value.destroy()
      viewer.value = null
      handleDestroyed()
    })

    return {
      viewerContainer
    }
  },
  render() {
    return (
      <div
        ref="viewerContainer"
        id="viewerContainer"
        class={namespace + '-viewer'}
      >
        {renderSlot(this.$slots, 'default')}
      </div>
    )
  }
})
