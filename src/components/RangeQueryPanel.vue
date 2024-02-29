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

let queryEntitiesArray = []

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

const data = ref([])

const loading = ref(false)

const pointName = ref("")

const selectedOption = ref(null)

const selectOptionList = computed(() => {
  return store.selectedTabs.filter(item => item.legendType === "query")
})

/*onMounted(() => {
  selectedOption.value = selectOptionList.value[0]
})*/

watchEffect(() => {
  if (selectOptionList.value.length === 0) {
    selectedOption.value = null
  }
})

watchEffect(async () => {
  // removeAllEntities()

  if (window[store.tabDataTitle]) {
    loading.value = true

    // selectedOption.value = store.tabDataTitle

    pointName.value = window[store.tabDataTitle]?.pointName

    console.log('selectedOption.value');
    console.log(selectedOption.value);

    data.value = window[selectedOption.value]?.queryDataList

    console.log('data###########');
    console.log(data);

    dataList.value = data.value?.slice(start, end)

    loading.value = false

    console.log('dataList.value');
    console.log(dataList.value);

    const lonName = window[selectedOption.value]?.lonName
    const latName = window[selectedOption.value]?.latName
    const iframeUrl = window[selectedOption.value]?.iframe

    /*dataList.value?.forEach((item) => {
      const longitude = item.geometry.coordinates[0]
      const latitude = item.geometry.coordinates[1]

      window[selectedOption.value].entitiesArray.push(
          addEntity(+longitude, +latitude, 20, "/assets/entity-icons/monitor.png", {
            longitude,
            latitude,
            iframeUrl
          })
      )
    })*/
  }

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
  if (currentPage.value === Math.floor(data.value.length / 10) + 1) {
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
  dataList.value = data.value.slice(start, end)

  // removeAllEntities()

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
  const x = item.geometry.coordinates[0]
  const y = item.geometry.coordinates[1]

  flyTo(x, y)
}

const onChangeType = (value) => {
  // store.setTabDataTitle(value)
  window.queryEntitiesArray.forEach(entity => {
    viewer.entities.remove(entity)
  })
  window.queryEntitiesArray = []
  const option = window[value]
  console.log('option');
  console.log(option);
  const {queryDataList, pointIcon} = option
  console.log('pointIcon');
  console.log(pointIcon);
  queryDataList.forEach(poi => {
    const longitude = poi.geometry.coordinates[0]
    const latitude = poi.geometry.coordinates[1]
    const description = poi.geometry.coordinates[2]
    const iframeUrl = description.iframeUrl
    window.queryEntitiesArray.push(
        addEntity(longitude, latitude, 20, pointIcon, {
          longitude,
          latitude,
          iframeUrl
        })
    )

  })
}


</script>

<template>
  <div class="panel-wrapper">
    <div class="close" @click="onClose">×</div>
    <!--    <div class="title">{{ props.title }}</div>-->
    <div class="title">范围查询列表</div>
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
        {{ item.geometry.coordinates[2].name }}
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
        {{ currentPage }}/{{ (Math.floor(data?.length / 10) + 1) || 1 }}
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
  right: 180px;
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
