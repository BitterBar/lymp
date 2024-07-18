<script setup lang="ts">
import {
  VViewer,
  VMarker,
  VOverlayGroup,
  VLabelMarker,
  VContent,
  VPolyline,
  VPolygon
} from 'lymp'
import { ref } from 'vue'

const pointVisible = ref(true)
const visible = ref(true)

const flag = ref(true)
window.addEventListener('keydown', e => {
  if (e.key === 'v') {
    flag.value = false
  }
})

window.addEventListener('keydown', e => {
  if (e.key === 'm') {
    pointVisible.value = !pointVisible.value
  }
})
window.addEventListener('keydown', e => {
  if (e.key === 'b') {
    visible.value = !visible.value
  }
})

const polylinePath = [
  [116.924717, 39.686595],
  [117.3405, 39.54355],
  [116.952974, 39.434514]
] as AMap.LngLatLike[]

const polygonPath = [
  [117.092936, 40.09692],
  [116.926402, 39.873621],
  [117.325389, 39.956114]
] as AMap.LngLatLike[]

const labelMarkerOptions: AMap.LabelMarkerOptions = {
  position: [116.301902, 39.817682],
  text: { content: 'LabelMarker', direction: 'bottom' },
  icon: {
    image: '//a.amap.com/lbs-dev-yuntu/static/web/image/common/robotIcon.png',
    size: [40, 40]
  }
}

const labelMarkerContentOptions: AMap.LabelMarkerOptions = {
  position: [115.43454, 39.817682],
  text: { content: 'LabelMarker-Content', direction: 'bottom' },
  icon: {
    image: '//a.amap.com/lbs-dev-yuntu/static/web/image/common/robotIcon.png',
    size: [40, 40]
  }
}
const labelMarkerContentBodyOptions: AMap.OverlayOptions = {
  position: labelMarkerContentOptions.position,
  content: 'Content',
  anchor: 'top-center',
  offset: [0, -60],
  visible: false
}

const markerOptions: AMap.MarkerOptions = {
  position: [118.160199, 39.845535]
}

const contentOptions: AMap.OverlayOptions = {
  position: [117.57172, 39.910888],
  content: 'Content'
}

const handleLog = (e: any) => console.log(e, 'mounted')
</script>

<template>
  <VViewer
    style="width: 100%; height: 100vh"
    :options="{ features: ['bg'], center: [116.395577, 39.892257] }"
  >
    <VOverlayGroup v-if="flag" :visible="pointVisible">
      <VMarker :options="markerOptions" />
      <VLabelMarker :options="labelMarkerOptions" />
      <VLabelMarker :options="labelMarkerContentOptions">
        <template #content>
          <VContent
            @mounted="v => console.log(v)"
            :options="labelMarkerContentBodyOptions"
          />
        </template>
      </VLabelMarker>
      <VContent :options="contentOptions" />
    </VOverlayGroup>

    <VOverlayGroup :visible="visible">
      <VPolyline
        :options="{ path: polylinePath, strokeWeight: 5, strokeColor: 'red' }"
      />
      <VPolygon
        @mounted="handleLog"
        :options="{
          path: polygonPath,
          strokeWeight: 5,
          strokeColor: 'red',
          fillColor: 'blue',
          fillOpacity: 0.25
        }"
      />
    </VOverlayGroup>
  </VViewer>
</template>
