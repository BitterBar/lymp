<script setup lang="ts">
import {
  VViewer,
  Icon,
  VMarkerCluster,
  type MarkerClusterOptions,
  type MarkerClusterClickEvent
} from 'lymp'
import { ref, h, render } from 'vue'
import ClusterMarkerContent from './components/ClusterMarkerContent'

const visible = ref(true)
const data = ref<AMap.MarkerClusterDataRow[] | undefined>()
const options: MarkerClusterOptions = {
  gridSize: 60
}
const handleClusterClick = (e: MarkerClusterClickEvent) => console.log(e)

const renderMarker: AMap.RenderMarker = context => {
  context.marker.setAnchor('center')
  context.marker.setIcon(
    new Icon({
      image: '//a.amap.com/lbs-dev-yuntu/static/web/image/common/robotIcon.png',
      imageSize: [32, 32]
    })
  )
} // 自定义非聚合点样式
const renderClusterMarker: AMap.RenderClusterMarker = context => {
  const div = document.createElement('div')
  context.marker.setContent(div)
  context.marker.setAnchor('center')

  render(
    h(ClusterMarkerContent, {
      count: context.count
    }),
    div
  )
} // 自定义聚合点样式

const updateData = () => {
  // @ts-ignore
  data.value = window.points.slice(0, Math.round(Math.random() * 1000 + 100))
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'd':
      updateData()
      break

    case 'v':
      visible.value = !visible.value
      break
  }
})
updateData()
</script>

<template>
  <VViewer
    style="width: 100%; height: 100vh"
    :options="{ features: ['bg'], center: [116.395577, 39.892257] }"
  >
    <VMarkerCluster
      :visible="visible"
      :data="data"
      :render-marker="renderMarker"
      :render-cluster-marker="renderClusterMarker"
      :options="options"
      @click="handleClusterClick"
    />
  </VViewer>
</template>
