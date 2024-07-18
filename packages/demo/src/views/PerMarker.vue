<script setup lang="ts">
import { VViewer, VLabelMarker, VLabelMarkerLayer } from 'lymp'
import { ref } from 'vue'

const visible = ref(true)

window.addEventListener('keydown', e => {
  if (e.key === 'v') {
    visible.value = !visible.value
  }
})

// @ts-ignore
const positions = window.Positions.slice(0, 3000) as AMap.Vector2[]
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
</script>

<template>
  <VViewer
    style="width: 100%; height: 100vh"
    :options="{ features: ['bg'], center: [116.395577, 39.892257] }"
  >
    <VLabelMarkerLayer :visible="visible" :options="{ collision: false }">
      <VLabelMarker
        v-for="(position, i) in positions"
        :key="i"
        :options="createOptions(position)"
      />
    </VLabelMarkerLayer>
  </VViewer>
</template>
