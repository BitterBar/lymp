<script setup lang="ts">
import { VViewer, VLabelMarker, VContent, VOverlayGroup } from 'lymp'
import { ref, defineComponent, h, render } from 'vue'

const visible = ref(true)

window.addEventListener('keydown', e => {
  if (e.key === 'v') {
    visible.value = !visible.value
  }
})

const positions = [
  [116.362209, 39.887487],
  [116.422897, 39.878002]
] as AMap.Vector2[]
const createOptions = (position: AMap.Vector2): AMap.LabelMarkerOptions => {
  return {
    position,
    text: { content: 'LabelMarker', direction: 'bottom' },
    icon: {
      image: '//a.amap.com/lbs-dev-yuntu/static/web/image/common/robotIcon.png',
      size: [40, 40]
    }
  }
}

const A = defineComponent(
  props => {
    return () =>
      h(
        'div',
        {
          style: {
            width: 'max-content'
          }
        },
        '飘窗' + props.id
      )
  },
  {
    props: {
      id: Number
    }
  }
)

const createContentOptions = (
  position: AMap.Vector2,
  id: number
): AMap.OverlayOptions => {
  const div = document.createElement('div')
  render(h(A, { id }), div)

  return {
    position,
    content: div,
    anchor: 'top-center',
    offset: [0, -60]
  }
}
</script>

<template>
  <VViewer
    style="width: 100%; height: 100vh"
    :options="{ features: ['bg'], center: [116.395577, 39.892257] }"
  >
    <VOverlayGroup :visible="visible">
      <VLabelMarker
        v-for="(position, i) in positions"
        :key="i"
        :options="createOptions(position)"
      >
        <template #content>
          <VContent :options="createContentOptions(position, i)" />
        </template>
      </VLabelMarker>
    </VOverlayGroup>
  </VViewer>
</template>
