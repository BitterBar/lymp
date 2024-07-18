<script setup lang="ts">
import { PulseLineLayer, VViewer, Viewer } from 'lymp'

const a = (viewer: Viewer) => {
  const loca = new Loca.Container({
    map: viewer
  })

  const geo = new Loca.GeoJSONSource({
    url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json'
  })

  const layer = new PulseLineLayer({
    zIndex: 10,
    opacity: 1,
    visible: true,
    zooms: [2, 22]
  })

  layer.on('click', viewer, e => {
    console.log(e)
  })

  layer.setSource(geo)
  loca.add(layer)
  loca.animate.start()
}
</script>

<template>
  <VViewer
    @mounted="a"
    style="width: 100%; height: 100vh"
    :options="{
      center: [116.352734, 39.8447]
    }"
  />
</template>
