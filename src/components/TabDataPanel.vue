<script setup>

import {computed, onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import MonitorPanel from "./MonitorPanel.vue";
import WorkOrderPanel from "./WorkOrderPanel.vue";
import HousePanel from "./HousePanel.vue";
import {useStore} from "../store/index.js";
import BujianPanel from "./BujianPanel.vue";
import {dataHttp, getMonitorCheckList, getVideoList, getWC, getWzK} from "../utils/request.js";
import {addEntity, addMonitorCheckEntity, addMonitorEntity, addWcEntity, addWzkEntity} from "../utils/entity.js";
import {flyTo} from "../utils/view.js";

const store = useStore()

const props = defineProps(['title', 'dataSource'])

const emit = defineEmits(["close"])

const onClose = () => {
  emit("close")
}

const searchInput = ref("")

const page = ref(1)

let start = 0
let end = 10
let step = 10

const dataList = ref([])

let data = []

const loading = ref(false)

const pointName = ref("")

const selectedOption = ref(null)

const selectOptionList = computed(() => {
  return store.selectedTabs.filter(item => item.legendType === "query")
})

watchEffect(() => {
  if (selectOptionList.value.length === 0) {
    selectedOption.value = null
  }
})

watchEffect(async () => {
  // removeAllEntities()

  if (window[store.tabDataTitle]) {
    loading.value = true

    selectedOption.value = store.tabDataTitle

    pointName.value = window[store.tabDataTitle]?.pointName

    const dataUrl = window[store.tabDataTitle]?.url

    if (!window[store.tabDataTitle].dataList) {
      window[store.tabDataTitle].dataList = (await dataHttp.get(dataUrl)).data.data
    }
    data = window[store.tabDataTitle].dataList

    dataList.value = data?.slice(start, end)

    loading.value = false

    console.log('dataList.value');
    console.log(dataList.value);

    const lonName = window[store.tabDataTitle].lonName
    const latName = window[store.tabDataTitle].latName
    const iframeUrl = window[store.tabDataTitle].iframe

    dataList.value?.forEach((item) => {
      const longitude = item[lonName]
      const latitude = item[latName]

      window[store.tabDataTitle].entitiesArray.push(
          addEntity(+longitude, +latitude, 20, "/assets/entity-icons/monitor.png", {
            longitude,
            latitude,
            iframeUrl
          })
      )
    })
  }

})

const scenePosition = ref(null);

function setBubblePosition() {
  if (scenePosition.value) {
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, scenePosition.value, windowPosition);
    document.getElementById("bubble-container").style.top = windowPosition.y + "px";
    document.getElementById("bubble-container").style.left = windowPosition.x + "px";
  }
}

onMounted(() => {
  // removeAllEntities()

  viewer.scene.postRender.addEventListener(setBubblePosition);

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction((movement) => {
    let position = viewer.scene.pickPosition(movement.position);
    const pick = viewer.scene.pick(movement.position);

    if (!pick) {
      store.setBubbleVisible(false)
    }

    if (!position) {
      scenePosition.value = Cesium.Cartesian3.fromDegrees(0, 0, 0);
    }

    if (pick && pick.id && pick.id._description) {
      const description = JSON.parse(pick.id._description)

      const iframeUrl = description.iframeUrl

      iframeUrl ?
          store.setIframeUrl(`${iframeUrl}?x=${description.longitude}&y=${description.latitude}`) :
          store.setBubbleVisible(false)

      scenePosition.value = Cesium.Cartesian3.fromDegrees(description.longitude, description.latitude)

      store.setBubbleVisible(true)
    }

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
})

const removeAllEntities = () => {
  window[store.tabDataTitle]?.entitiesArray?.forEach((entity) => {
    viewer.entities.remove(entity)
  })
}

const currentPage = ref(1)

const onLastPage = () => {
  if (page.value === 1) {
    return
  }

  currentPage.value -= 1
  page.value = +page.value - 1

  onChangePage(page.value)
}

const onNextPage = () => {
  if (currentPage.value === Math.floor(data.length / 10) + 1) {
    return
  }

  currentPage.value += 1
  page.value = +page.value + 1

  onChangePage(page.value)
}

const onChangePage = (val) => {
  const lonName = window[store.tabDataTitle].lonName
  const latName = window[store.tabDataTitle].latName

  currentPage.value = +val
  start = (currentPage.value - 1) * step
  end = (currentPage.value - 1) * step + 10
  dataList.value = data.slice(start, end)

  removeAllEntities()

  dataList.value.forEach((item) => {
    const longitude = item[lonName]
    const latitude = item[latName]

    window[store.tabDataTitle].entitiesArray.push(
        addEntity(+longitude, +latitude, 20, "/assets/entity-icons/monitor.png", {
          longitude,
          latitude
        })
    )
  })
}

const onClickData = (item) => {
  const lonName = window[store.tabDataTitle].lonName
  const latName = window[store.tabDataTitle].latName

  flyTo(+item[lonName], +item[latName])
}

const onChangeType = (value) => {
  store.setTabDataTitle(value)
}


</script>

<template>
  <div class="panel-wrapper">
    <div class="close" @click="onClose">×</div>
    <!--    <div class="title">{{ props.title }}</div>-->
    <div class="title">图例数据查询列表</div>
    <div class="select-wrapper">
      <el-select
          v-model="selectedOption"
          class="m-2"
          placeholder="请选择图例类别"
          style="width: 100%"
          @change="onChangeType"
          no-data-text="暂无数据"
      >
        <el-option
            v-for="item in selectOptionList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
        />
      </el-select>
    </div>
    <!--    <div class="search">
          <el-input v-model="searchInput"/>
          <img src="../assets/images/searchIcon.png" alt="">
        </div>-->
    <div v-if="store.selectedTabs.length" class="dataList" v-loading="loading">
      <div v-for="item in dataList" :key="item.name" :class="{'data-item': !loading}" @click="() => onClickData(item)">
        {{ item[pointName] }}
      </div>
    </div>
    <div v-else class="no-data">
      暂无数据
    </div>
    <div class="page-nation">
      <p @click="onLastPage"> {{ "<<" }} </p>
      <div :style="{margin:'0 12px'}">
        <el-input v-model="page" @change="onChangePage"/>
      </div>
      <p @click="onNextPage"> {{ ">>" }} </p>
      <div class="option">
        {{ currentPage }}/{{ Math.floor(data?.length / 10) + 1 }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  background: none;
}

:deep(.el-input__inner) {
  color: white;
  text-align: left;
  font-size: 16px;
}

:deep(.el-input__wrapper) {
  background: rgba(16, 35, 61, 1);
  border: none;
  box-shadow: none;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
}

.panel-wrapper {
  width: 331px;
  height: 700px;
  position: absolute;
  left: 280px;
  top: 150px;
  z-index: 10;
  background: url("../assets/images/tab-data-panel-bg.png") no-repeat;
  background-size: 100% 100%;
  color: white;
  padding: 0 18px;

  .select-wrapper {
    margin: 12px 0;
  }

  .close {
    position: absolute;
    font-size: 32px;
    right: 8px;
    top: 4px;
    cursor: pointer;
  }

  .title {
    padding: 12px 18px;
  }

  .search {
    display: flex;
    height: 38px;
    margin: 18px 0;

    > img {
      cursor: pointer;
    }
  }

  .no-data {
    color: gray;
    text-align: center;
  }

  .dataList {
    height: 520px;
    overflow: auto;

    .data-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      padding: 12px;
      cursor: pointer;
    }
  }

  .page-nation {
    position: absolute;
    bottom: 12px;
    width: calc(100% - 36px);
    padding: 12px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;

    p {
      cursor: pointer;
    }

    .option {
      font-size: 16px;
      padding: 0 12px;
    }

    :deep(.el-input__inner) {
      color: white;
      text-align: center;
      font-size: 16px;
      width: 24px;
    }
  }
}
</style>
