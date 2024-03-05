<script setup>
import {computed, onMounted, ref} from "vue";
import {getImageUrl} from "../utils/getImage.js";
import {http} from "../utils/http.js";
import {useStore} from "../store/index.js";
import {useRoute} from "vue-router";
import MonitorPanel from "./MonitorPanel.vue";
import * as tools from "../utils/tool.js"
import {boxSelectQuery, calcArea, calcDistance, clear, reset} from "../utils/tool.js";
import {circle, pointsWithinPolygon, points, point, polygon} from "@turf/turf";
import {transformGeometricPosition} from "../utils/view.js";
import {addEntity} from "../utils/entity.js";

const store = useStore()

const toolList = ref([])

let activeShapePoints = [];
let activeShape;
let floatingPoint;
let entitiesArray = [];
let circleCenter = []
let radius = 0
let active = false
let allPointsArray = []

let boxActive = false
let drawingManager
let positions = []
let polygon1

const toolMap = {
  "点位查询": getImageUrl("clickToQuery"),
  "范围查询": getImageUrl("rangeQuery"),
  "圈选查询": getImageUrl("circleSelectionQuery"),
  "框选查询": getImageUrl("boxSelectionQuery"),
  "缓冲区查询": getImageUrl("bufferQuery"),
  "坐标拾取": getImageUrl("coordinatePicking"),
  "测量": getImageUrl("measure"),
  "距离测量": getImageUrl("distanceMeasurement"),
  "面积测量": getImageUrl("areaMeasurement"),
  "视点管理": getImageUrl("viewpointManagement"),
  "图层复位": getImageUrl("layerReset"),
  "场景漫游": getImageUrl("sceneRoaming"),
}

/*const toolMapx = ref([
  {
    name: "点位查询",
    imageName: getImageUrl("clickToQuery")
  },
  {
    name: "范围查询",
    imageName: getImageUrl("rangeQuery"),
    childrenVisible: false,
    children: [
      {
        name: "框选查询",
        imageName: getImageUrl("boxSelectionQuery"),
      },
      {
        name: "圈选查询",
        imageName: getImageUrl("circleSelectionQuery"),
      },
      {
        name: "缓冲区查询",
        imageName: getImageUrl("bufferQuery"),
      }
    ]
  },
  {
    name: "坐标拾取",
    imageName: getImageUrl("coordinatePicking")
  },
  {
    name: "测量",
    imageName: getImageUrl("measure"),
    childrenVisible: false,
    children: [
      {
        name: "距离测量",
        imageName: getImageUrl("distanceMeasurement"),
      },
      {
        name: "面积测量",
        imageName: getImageUrl("areaMeasurement"),
      }
    ]
  },
  {
    name: "视点管理",
    imageName: getImageUrl("viewpointManagement")
  },
  {
    name: "图层复位",
    imageName: getImageUrl("layerReset")
  },
  {
    name: "场景漫游",
    imageName: getImageUrl("sceneRoaming")
  },
])*/

onMounted(async () => {
  const {id} = useRoute().query

  const res1 = await http.get("/templateConfig/get", {
    id
  })

  const toolbarStatus = JSON.parse(res1.data.toolbarStatus)

  console.log('toolbarStatus======');
  console.log(toolbarStatus);

  const res2 = await http.get("/toolbarConfig/getTree")

  console.log('res2====toolbar===status');
  console.log(res2.data);

  toolList.value = res2.data.filter(item => {
    return toolbarStatus.find(tool => tool === item.id)
  })
})

const selectOptionList = computed(() => {
  return store.selectedTabs.filter(item => item.legendType === "query")
})

const selectedTool = ref({
  toolName: ""
})

const childrenBarVisible = ref(false)

const map = {
  "坐标拾取": "zbsq",
  "图层复位": "reset"
}

const clearCircle = () => {
  window.queryEntitiesArray.forEach(entity => {
    viewer.entities.remove(entity)
  })
  window.queryEntitiesArray = []

  store.setRangeQueryPanelVisible(false)
  entitiesArray.forEach(item => {
    viewer.entities.remove(item)
  })

  activeShapePoints = [];
  activeShape = undefined
  floatingPoint = undefined;
  entitiesArray = [];
  circleCenter = []
  radius = 0
  active = false
  allPointsArray = []
}

const clearBox = () => {
  window.queryEntitiesArray.forEach(entity => {
    viewer.entities.remove(entity)
  })
  window.queryEntitiesArray = []

  boxActive = false
  drawingManager?.clear()
  drawingManager = undefined
  positions = []
  entitiesArray.forEach(item => {
    viewer.entities.remove(item)
  })
  entitiesArray = []
  // polygon1 = undefined
  allPointsArray = []
}

const onClickToolItem = (item) => {
  if (item.toolName === '图层复位') {
    console.log("clear=====")
    clearCircle()
    clearBox()
    active = true
    window.queryEntitiesArray.forEach(entity => {
      viewer.entities.remove(entity)
    })
    window.queryEntitiesArray = []
  }

  if (selectedTool.value.toolName === item.toolName) {
    selectedTool.value = {
      toolName: ""
    }
    clear()

    if (item.toolName === "视点管理") {
      store.setViewPanelVisible(false)
    }

    return
  }

  tools[map[item.toolName]]?.()

  if (item.toolName === "视点管理") {
    store.setViewPanelVisible(true)
  }

  childrenBarVisible.value = false

  selectedTool.value = item

  if (item.children.length > 0) {
    childrenBarVisible.value = true
  }

  console.log('item');
  console.log(item);
}

const onClickChildItem = (item) => {
  console.log('====child item====');
  console.log(item);

  const styleSelection = JSON.parse(item.styleSelection)
  console.log('styleSelection');
  console.log(styleSelection);

  const lineStyle = styleSelection.find(x => x.name === "边框:")
  const fillStyle = styleSelection.find(x => x.name === "填充:")

  console.log('lineStyle,fillStyle');
  console.log(lineStyle, fillStyle);

  const lineColor = lineStyle.HEX
  const fillColor = fillStyle.HEX

  if (item.toolName === "距离测量") {
    calcDistance(lineColor, fillColor)
  } else if (item.toolName === "面积测量") {
    calcArea()
  } else if (item.toolName === "框选查询") {
    selectOptionList.value.forEach(item => {
      window[item.name].queryDataList = []
    })

    // boxSelectQuery(lineColor, fillColor)
    clearBox()
    clearCircle()

    active = true

    if (boxActive) {
      return
    }

    drawingManager = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon);

    // 当绘制完成时的回调函数
    drawingManager.drawEvt.addEventListener(function (result) {
      positions = result.object.positions;
      entitiesArray.push(
          viewer.entities.add({
            polygon: {
              hierarchy: positions,
              material: Cesium.Color.fromCssColorString(fillColor).withAlpha(fillStyle.Alpha / 100),
              outline: true, // 开启边框
              outlineColor: Cesium.Color.fromCssColorString(lineColor), // 边框颜色
              outlineWidth: 2.0 // 边框宽度
            }
          })
      );

      // 打印多边形的顶点坐标
      const transPositions = positions.map(poi => {
        const {lng, lat} = transformGeometricPosition(poi.x, poi.y, poi.z)
        return [lng, lat]
      })

      const boxPolygon = polygon([[
        ...transPositions, transPositions[0]
      ]])

      selectOptionList.value.forEach(item => {
        const {lonName, latName, dataList, pointName, iframe} = window[item.name]
        dataList.forEach(poi => {
          allPointsArray.push([+poi[lonName], +poi[latName], {
            name: poi[pointName],
            type: item.name,
            iframeUrl: iframe
          }])
        })
      })

      const ptsWithin = pointsWithinPolygon(points(allPointsArray), boxPolygon);
      console.log('ptsWithin');
      console.log(ptsWithin);
      store.setRangeQueryPanelVisible(true)

      selectOptionList.value.forEach(item => {
        window[item.name].queryDataList = ptsWithin.features.filter(poi => poi.geometry.coordinates[2].type === item.name)
      })

      // 停用绘制处理器
      drawingManager.deactivate();
      boxActive = false
    });

    // 开始绘制多边形
    drawingManager.activate();

  } else if (item.toolName === "圈选查询") {
    clearCircle()
    clearBox()

    store.setRangeQueryPanelVisible(false)

    selectOptionList.value.forEach(item => {
      window[item.name].queryDataList = []
    })

    console.log("圈选查询")

    function createPoint(worldPosition) {
      const point = viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });
      entitiesArray.push(point);
      return point;
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    const drawShape = (positionData) => {
      const value = typeof positionData.getValue === "function" ? positionData.getValue(0) : positionData;
      const circleEntity = viewer.entities.add({
        position: activeShapePoints[0],
        name: "Blue translucent, rotated, and extruded ellipse with outline",
        type: "Selection tool",
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(() => {
            //半径 两点间距离
            const r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
            radius = r;
            return r ? r : r + 1;
          }, false),
          semiMajorAxis: new Cesium.CallbackProperty(function () {
            const r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
            return r ? r : r + 1;
          }, false),
          material: Cesium.Color.fromCssColorString(fillColor).withAlpha(fillStyle.Alpha / 100),
          outlineColor: Cesium.Color.fromCssColorString(lineColor),
          outlineWidth: 2.0
        }
      });
      entitiesArray.push(circleEntity);
      return circleEntity;
    };

    //鼠标左键
    handler.setInputAction((event) => {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      // if (this.active) return;
      if (active) return;
      const earthPosition = viewer.scene.pickPosition2D(event.position);
      console.log('earthPosition');
      console.log(earthPosition);
      const {x, y, z} = earthPosition
      const {lng, lat} = transformGeometricPosition(x, y, z)

      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          floatingPoint = createPoint(earthPosition);
          activeShapePoints.push(earthPosition);
          const dynamicPositions = new Cesium.CallbackProperty(function () {
            return activeShapePoints;
          }, false);
          activeShape = drawShape(dynamicPositions);//绘制动态图
        }
        activeShapePoints.push(earthPosition);
        circleCenter.push({x: lng, y: lat});
        createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标移动
    handler.setInputAction(function (event) {
      if (Cesium.defined(floatingPoint)) {
        const newPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          floatingPoint.position.setValue(newPosition);
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    const terminateShape = () => {
      activeShapePoints.pop();//去除最后一个动态点
      if (activeShapePoints.length) {
        drawShape(activeShapePoints).ellipse._semiMajorAxis.getValue();//绘制最终图
      }
      viewer.entities.remove(floatingPoint);//去除动态点图形（当前鼠标点）
      viewer.entities.remove(activeShape);//去除动态图形
      floatingPoint = undefined;
      activeShape = undefined;
      activeShapePoints = [];
    };

    handler.setInputAction(async () => {
      const options = {units: "meters", properties: {foo: "bar"}};

      const circlePolygon = circle([circleCenter[0].x, circleCenter[0].y], radius, options);

      console.log('selectOptionList');
      console.log(selectOptionList.value);

      selectOptionList.value.forEach(item => {
        console.log('window[item].name');
        console.log(window[item.name]);
        const {lonName, latName, dataList, pointName, iframe} = window[item.name]
        dataList.forEach(poi => {
          allPointsArray.push([+poi[lonName], +poi[latName], {
            name: poi[pointName],
            type: item.name,
            iframeUrl: iframe
          }])
        })
      })

      const ptsWithin = pointsWithinPolygon(points(allPointsArray), circlePolygon);
      console.log("ptsWithin");
      console.log(ptsWithin);

      selectOptionList.value.forEach(item => {
        window[item.name].queryDataList = ptsWithin.features.filter(poi => poi.geometry.coordinates[2].type === item.name)
      })

      terminateShape();
      active = true;

      store.setRangeQueryPanelVisible(true)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
}

</script>

<template>
  <div class="toolbar-wrapper">
    <div v-for="item in toolList"
         :key="item.toolName"
         class="tool-item"
         :class="{active: selectedTool.toolName === item.toolName}"
    >
      <div class="childrenBar" v-if="item.children?.length>0 && item.toolName === selectedTool.toolName">
        <div v-for="childItem in item.children" :key="childItem.toolName" class="child-item"
             @click="() => onClickChildItem(childItem)">
          <!--          <img :src="childItem.imageName" alt="">-->
          <img :src="toolMap[childItem.toolName]" alt="">
          <span>{{ childItem.toolName }}</span>
        </div>
      </div>
      <el-tooltip
          class="box-item"
          effect="dark"
          :content="item.toolName"
          placement="left-start"
      >
        <!--        <img :src="item.imageName" alt="">-->
        <img :src="toolMap[item.toolName]" alt="" @click="() => onClickToolItem(item)">
      </el-tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-wrapper {
  z-index: 10;
  position: absolute;
  right: 37px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(29, 63, 116, 0.8);
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;

  .tool-item {
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;

    .childrenBar {
      background: url("../assets/images/tool-children-bg.png") no-repeat;
      background-size: 100% 100%;
      width: 124px;
      position: absolute;
      right: 60px;
      padding: 8px;
      cursor: pointer;

      .child-item {
        display: flex;
        align-items: center;
        padding: 4px 0;

        img {
          width: 17px;
          height: 17px;
          margin-right: 8px;
        }
      }

    }

    &.active {
      background: rgba(29, 63, 116, 1);
    }

    img {
      width: 27px;
      height: 30px;
    }

    &:not(:last-child) {
    }
  }


}
</style>
