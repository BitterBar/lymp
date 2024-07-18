import type { PropType } from 'vue'
import type { MaybeArray } from '../utils/vue/call'

export default function createLifeCycleProps<T>() {
  return {
    onMounted: [Function, Array] as PropType<MaybeArray<(e: T) => void>>,
    onDestroyed: [Function, Array] as PropType<MaybeArray<(e: T) => void>>
  }
}
