<script setup>
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {http} from "../utils/http.js";
import {findMapLayer} from "../utils/layer.js";

const addMapLayers = () => {
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

onMounted(async () => {
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

  const {id} = useRoute().query
  const res2 = await http.get("/templateConfig/get", {
    id
  })

  console.log('res2');
  console.log(res2.data);

  const underlay = res2.data.underlay

  if (+underlay === 0) {
    console.log("矢量")
    findMapLayer("dt").show = true
  } else if (+underlay === 1) {
    console.log("网格")
    findMapLayer("grid").show = true
  } else if (+underlay === 2) {
    console.log("影像")
    findMapLayer("wgdt").show = true
  }

  // 所有图例数据
  const res3 = await http.get("/front/getByTemplateId", {
    templateId: id
  })
  console.log('res3.data=========');
  console.log(res3.data);

  res3.data.filter(item => item.legendStatus).forEach(tab => {
    const type = tab.legendType

    const iframeUrl = tab.iframe

    if (tab.gisAddress) {
      const gisAddress = tab.gisAddress
      const legendName = tab.legendName

      if (type === "3D") {
        const promise = viewer.scene.addS3MTilesLayerByScp(gisAddress, {name: legendName});
        promise.then((item) => {
          item.visible = false
        })
      } else if (type === "MAP") {
        const layer = new Cesium.SuperMapImageryProvider({
          url: gisAddress, //影像服务的地址
          name: legendName,
        });
        viewer.imageryLayers.addImageryProvider(layer);
        findMapLayer(legendName).show = false
      }
    }

    if (type === "query") {
      const name = tab.legendName
      const serviceAddress = tab.serviceAddress

      window[name] = {
        entitiesArray: [],
      }

      if (serviceAddress) {
        const obj = JSON.parse(serviceAddress)
        window[name].url = obj.url
        window[name].lonName = obj.x
        window[name].latName = obj.y
        window[name].pointName = obj.pointName
        window[name].iframe = iframeUrl
      }
    }

    if (tab.children?.length > 0) {
      tab.children.forEach(item => {
        if (item.gisAddress) {
          const gisAddress = item.gisAddress
          const legendName = item.name

          if (type === "3D") {
            const promise = viewer.scene.addS3MTilesLayerByScp(gisAddress, {name: legendName});
            promise.then((item) => {
              item.visible = false
            })
          } else if (type === "MAP") {
            const layer = new Cesium.SuperMapImageryProvider({
              url: gisAddress, //影像服务的地址
              name: legendName,
            });
            viewer.imageryLayers.addImageryProvider(layer);
            findMapLayer(legendName).show = false
          }
        }

        if (type === "query") {
          const name = item.name
          const serviceAddress = item.serviceAddress
          const iframeUrl = item.iframe

          window[name] = {
            entitiesArray: [],
          }

          if (serviceAddress) {
            const obj = JSON.parse(serviceAddress)
            window[name].url = obj.url
            window[name].lonName = obj.x
            window[name].latName = obj.y
            window[name].pointName = obj.pointName
            window[name].iframe = iframeUrl
          }
        }
      })
    }

  })

  const {x, y, z, heading, pitch, roll} = res2.data

  viewer.camera.setView({
    destination: new Cesium.Cartesian3.fromDegrees(x, y, z),
    orientation: {
      heading,
      pitch,
      roll,
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
