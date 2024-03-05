<script setup>

import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {useStore} from "../store/index.js";
import {addEntity} from "../utils/entity.js";
import {flyTo} from "../utils/view.js";
import axios from "axios";
import {Search} from "@element-plus/icons-vue"

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

// let data = []

const data = ref([])

const searchDataList = ref([])

const loading = ref(false)

const pointName = ref("")

const selectedOption = ref(null)

const selectOptionList = computed(() => {
  return store.selectedTabs.filter(item => item.legendType === "query")
})

const totalPages = computed(() => {
  return data.value?.length % 10 === 0 ? data.value?.length / 10 : (Math.floor(data.value?.length / 10) + 1) || 1
})

watchEffect(() => {
  if (selectOptionList.value.length === 0) {
    selectedOption.value = null
  }
})

watch(() => store.tabDataTitle, async () => {
  if (window[store.tabDataTitle]) {
    loading.value = true

    selectedOption.value = store.tabDataTitle

    pointName.value = window[store.tabDataTitle]?.pointName

    const dataUrl = window[store.tabDataTitle]?.url

    if (!window[store.tabDataTitle].dataList) {
      // window[store.tabDataTitle].dataList = (await dataHttp.get(dataUrl)).data.data
      window[store.tabDataTitle].dataList = (await axios.get(dataUrl)).data.data
    }
    data.value = window[store.tabDataTitle].dataList

    dataList.value = data.value?.slice(start, end)

    loading.value = false

    console.log('dataList.value===1');
    console.log(dataList.value);

    const lonName = window[store.tabDataTitle].lonName
    const latName = window[store.tabDataTitle].latName
    const iframeUrl = window[store.tabDataTitle].iframe
    const pointIcon = window[store.tabDataTitle].pointIcon
    // const pointName = window[store.tabDataTitle]?.pointName
    console.log('pointIcon');
    console.log(pointIcon);

    dataList.value?.forEach((item) => {
      const longitude = item[lonName]
      const latitude = item[latName]
      const name = item[pointName.value]

      // "api/YangZhou/images/wuyziku.png"
      window[store.tabDataTitle].entitiesArray.push(
          addEntity(+longitude, +latitude, 20, pointIcon, {
            longitude,
            latitude,
            iframeUrl,
            name
          })
      )
    })
  }
})

/*watchEffect(async () => {
  // removeAllEntities()

  if (window[store.tabDataTitle]) {
    loading.value = true

    selectedOption.value = store.tabDataTitle

    pointName.value = window[store.tabDataTitle]?.pointName

    const dataUrl = window[store.tabDataTitle]?.url

    if (!window[store.tabDataTitle].dataList) {
      // window[store.tabDataTitle].dataList = (await dataHttp.get(dataUrl)).data.data
      window[store.tabDataTitle].dataList = (await axios.get(dataUrl)).data.data
    }
    data.value = window[store.tabDataTitle].dataList

    dataList.value = data.value?.slice(start, end)

    loading.value = false

    console.log('dataList.value===1');
    console.log(dataList.value);

    const lonName = window[store.tabDataTitle].lonName
    const latName = window[store.tabDataTitle].latName
    const iframeUrl = window[store.tabDataTitle].iframe
    const pointIcon = window[store.tabDataTitle].pointIcon
    // const pointName = window[store.tabDataTitle]?.pointName
    console.log('pointIcon');
    console.log(pointIcon);

    dataList.value?.forEach((item) => {
      const longitude = item[lonName]
      const latitude = item[latName]
      const name = item[pointName.value]

      // "api/YangZhou/images/wuyziku.png"
      window[store.tabDataTitle].entitiesArray.push(
          addEntity(+longitude, +latitude, 20, pointIcon, {
            longitude,
            latitude,
            iframeUrl,
            name
          })
      )
    })
  }

})*/

const scenePosition = ref(null);
const scenePosition2 = ref(null);

function setBubblePosition() {
  if (scenePosition.value) {
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, scenePosition.value, windowPosition);
    document.getElementById("bubble-container").style.top = windowPosition.y + "px";
    document.getElementById("bubble-container").style.left = windowPosition.x + "px";
  }
}

function setBubblePosition2() {
  if (scenePosition2.value) {
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, scenePosition2.value, windowPosition);
    document.getElementById("hover-bubble-container").style.top = windowPosition.y + "px";
    document.getElementById("hover-bubble-container").style.left = windowPosition.x + "px";
  }
}

onMounted(() => {
  // removeAllEntities()

  // viewer.scene.postRender.addEventListener(setBubblePosition);

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction((movement) => {
    let position = viewer.scene.pickPosition(movement.position);
    const pick = viewer.scene.pick(movement.position);

    if (!pick) {
      store.setBubbleVisible(false)
    }

    /*if (!position) {
      scenePosition.value = Cesium.Cartesian3.fromDegrees(0, 0, 0);
    }*/

    if (pick && pick.id && pick.id._description) {
      const description = JSON.parse(pick.id._description)

      console.log('description');
      console.log(description);

      const iframeUrl = description.iframeUrl

      iframeUrl ?
          store.setIframeUrl(`${iframeUrl}?x=${description.longitude}&y=${description.latitude}`) :
          store.setBubbleVisible(false)

      // scenePosition.value = Cesium.Cartesian3.fromDegrees(description.longitude, description.latitude)

      store.setBubbleVisible(true)
    }

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
})

onMounted(() => {
  viewer.scene.postRender.addEventListener(setBubblePosition2);
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction((movement) => {
    const position = viewer.scene.pickPosition(movement.endPosition);
    const pick = viewer.scene.pick(movement.endPosition);

    if (!pick) {
      store.setHoverBubbleVisible(false)
    }

    if (!position) {
      scenePosition2.value = Cesium.Cartesian3.fromDegrees(0, 0, 0);
    }

    if (pick && pick.id && pick.id._description) {
      const description = JSON.parse(pick.id._description)

      scenePosition2.value = Cesium.Cartesian3.fromDegrees(description.longitude, description.latitude)

      store.setHoverBubbleVisible(true)
      store.setCurrentHoverEntityName(description.name)
    }

  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
})

const removeAllEntities = () => {
  window[store.tabDataTitle]?.entitiesArray?.forEach((entity) => {
    viewer.entities.remove(entity)
  })
}

const currentPage = ref(1)

const onLastPage = () => {
  if (page.value === 1 || currentPage.value === 1) {
    return
  }

  currentPage.value -= 1
  page.value = +page.value - 1

  onChangePage(page.value)
}

const onNextPage = () => {
  if (currentPage.value === totalPages.value) {
    return
  }

  currentPage.value += 1
  page.value = +page.value + 1

  onChangePage(page.value)
}

const onChangePage = (val) => {
  const lonName = window[store.tabDataTitle].lonName
  const latName = window[store.tabDataTitle].latName
  const pointIcon = window[store.tabDataTitle].pointIcon
  const iframeUrl = window[store.tabDataTitle].iframe

  currentPage.value = +val
  page.value = +val
  start = (currentPage.value - 1) * step
  end = (currentPage.value - 1) * step + 10
  dataList.value = data.value.slice(start, end)

  removeAllEntities()

  dataList.value.forEach((item) => {
    const longitude = item[lonName]
    const latitude = item[latName]
    const name = item[pointName.value]

    window[store.tabDataTitle].entitiesArray.push(
        addEntity(+longitude, +latitude, 20, pointIcon, {
          longitude,
          latitude,
          iframeUrl,
          name
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

  currentPage.value = 1
  page.value = 1
  onChangePage(page.value)

  searchInput.value = ""
}

const onSearch = () => {
  if (searchInput.value) {
    onClear()

    searchDataList.value = data.value.filter(item => {
      return item[pointName.value]?.includes(searchInput.value)
    })
    data.value = searchDataList.value
    onChangePage(1)
    dataList.value = data.value?.slice(start, end)

  } else {
    onClear()
  }
}

const onClear = () => {
  data.value = window[store.tabDataTitle].dataList
  onChangePage(1)
  dataList.value = data.value?.slice(start, end)
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
    <div class="search">
      <el-input placeholder="输入查询条件" v-model="searchInput" clearable @change="onSearch" @clear="onClear"/>
      <!--      <img src="../assets/images/searchIcon.png" alt="" @click="onSearch">-->
    </div>
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
        {{ currentPage }}/{{ totalPages }} 页
      </div>
    </div>
    <div class="total">
      共 {{ data.length }} 条数据
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
  height: 750px;
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
    margin-top: 12px;
    margin-bottom: 8px;

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

  .total {
    position: absolute;
    bottom: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 36px);
  }

  .page-nation {
    position: absolute;
    bottom: 32px;
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
