<script setup>
import {onMounted} from "vue";

const addMapLayers = () => {
  viewer.imageryLayers.addImageryProvider(new Cesium.SuperMapImageryProvider({
    url: `/map/iserver/services/3D-sci3dtest/rest/realspace/datas/SLMAPSP1`,
    name: 'dt'
  }));

  MapUrlHashmap.forEach((map) => {
    const layer = new Cesium.SuperMapImageryProvider({
      url: map.url, //影像服务的地址
      name: map.name,
    });
    viewer.imageryLayers.addImageryProvider(layer);
  });

  viewer.imageryLayers._layers.forEach((item) => {
    const layerNameList = MapUrlHashmap.map(map => map.name)

    if (layerNameList.indexOf(item._imageryProvider.name) >= 0) {
      item.show = false;
    }
  });
}

onMounted(() => {
  window.viewer = new Cesium.Viewer("cesiumContainer", {
    shadows: true,
    infoBox: false,
    navigation: false, //指南针
    selectionIndicator: false, //绿色选择框
  });

  addMapLayers()

  const {scene} = viewer;

  viewer._cesiumWidget._creditContainer.style.display = "none";
  scene.globe.depthTestAgainstTerrain = false; // 图标不埋地下

  viewer.camera.setView({
    destination: new Cesium.Cartesian3(
        -2644629.573815722, 4691961.7257883055, 3417429.273117738
    ),
    orientation: {
      heading: 0.0002902133446696098,
      pitch: -1.570277293405637,
      roll: 0,
    },
  });
})

</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
