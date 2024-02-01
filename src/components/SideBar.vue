<script setup>
import {getImageUrl} from "../utils/getImage.js";
import {onMounted, ref} from "vue";
import {useStore} from "../store/index.js";
import {http} from "../utils/http.js";

// 侧边栏一级菜单列表
const tabItemList = ref([
  {
    name: "倾斜模型",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "手工模型",
    imageName: getImageUrl("shougong"),
    imageActiveName: getImageUrl("shougong-active")
  },
  {
    name: "BIM模型",
    imageName: getImageUrl("bim"),
    imageActiveName: getImageUrl("bim-active")
  },
  {
    name: "监控",
    imageName: getImageUrl("jiankong"),
    imageActiveName: getImageUrl("jiankong-active")
  },
  {
    name: "监控核查",
    imageName: getImageUrl("hecha"),
    imageActiveName: getImageUrl("hecha-active")
  },
  {
    name: "人房",
    imageName: getImageUrl("renfang"),
    imageActiveName: getImageUrl("renfang-active")
  },
  {
    name: "部件",
    imageName: getImageUrl("bujian"),
    imageActiveName: getImageUrl("bujian-active")
  },
  {
    name: "工单",
    imageName: getImageUrl("gongdan"),
    imageActiveName: getImageUrl("gongdan-active")
  },
])

// 部件二级菜单列表
const bujianItemList = ref([
  {
    name: "物资库",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "危险源",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "基本部件",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "公共厕所",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "诱导屏",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "水源地",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "水文监测站",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "医疗垃圾",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "避难场所",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
  {
    name: "图书馆",
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  },
])

onMounted(async () => {
  // 所有图例数据
  const res1 = await http.get("/legendInfo/queryAll")

  tabItemList.value.map(tab => {
    tab.id = res1.data.find(item => item.legendName === tab.name)?.id
    tab.sort = res1.data.find(item => item.legendName === tab.name)?.sort
    tab.secondaryColumn = res1.data.find(item => item.legendName === tab.name)?.secondaryColumn
    return tab
  })

  // 后台返回的图例数据
  const res2 = await http.get("/templateConfig/get", {
    id: "1752519872051982338"
  })

  const legendStatus = JSON.parse(res2.data.legendStatus)

  tabItemList.value = tabItemList.value.filter(tab => {
    const des = legendStatus.find(item => item.id === tab.id)
    return des.checked
  }).sort((a, b) => {
    return a.sort - b.sort
  })

  bujianItemList.value = JSON.parse(tabItemList.value.find(item => item.name === "部件")?.secondaryColumn)
  bujianItemList.value = bujianItemList.value.map(item => ({
    ...item,
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  })).filter(item => item.isEnable)
})


const activeTabList = ref([])

const store = useStore()

const map = {
  "人房": {
    title: "人房列表",
    data: [
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
      {name: "人房1"},
    ]
  },
  "监控": {
    title: "监控列表",
    data: [
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
      {name: "监控1"},
    ]
  },
  "监控核查": {
    title: "监控核查列表",
    data: [
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
      {name: "监控核查1"},
    ]
  },
  "工单": {
    title: "工单列表",
    data: [
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"},
      {name: "工单1"}
    ]
  }
}

const tabListVisible = ref(true)
const bujianListVisible = ref(false)

const onClickStatusControl = () => {
  if (store.sideBarStatusText === "上一级") {
    store.setSideBarStatusText("收起")
    bujianListVisible.value = false
    tabListVisible.value = true
  } else if (store.sideBarStatusText === "收起") {
    tabListVisible.value = false
    store.setSideBarStatusText("展开")
  } else {
    tabListVisible.value = true
    store.setSideBarStatusText("收起")
  }
}

const onClickTab = (tab) => {
  const clickItem = activeTabList.value.find(item => tab.name === item.name)
  if (tab.name === "部件") {
    store.setSideBarStatusText("上一级")
    bujianListVisible.value = true
    tabListVisible.value = false
  } else if (clickItem) {
    activeTabList.value.splice(activeTabList.value.indexOf(clickItem), 1)
  } else {
    activeTabList.value.push(tab)

    if (map[tab.name]) {
      store.setTabDataPanelVisible(true)
      store.setTabDataTitle(map[tab.name].title)
      store.setTabDataList(map[tab.name].data)
    }

  }
}

</script>

<template>
  <div class="side-bar-wrapper">
    <div class="controller" @click="onClickStatusControl">
      <img v-show="store.sideBarStatusText === '展开'|| store.sideBarStatusText === '收起' "
           src="../assets/images/tab-icon.png" alt="">
      <img v-show="store.sideBarStatusText === '上一级'" src="../assets/images/comeback.png" alt="">
      <span>{{ store.sideBarStatusText }}</span>
    </div>
    <div class="tabs-wrapper" v-show="tabListVisible">
      <div
          v-for="item in tabItemList"
          :key="item.name"
          class="tab-item"
          @click="() => onClickTab(item)"
          :style="{backgroundImage: activeTabList.find(tab => tab.name === item.name)? `url(${item.imageActiveName})`:`url(${item.imageName})` , backgroundSize:'100% 100%'}"
      >
        <span class="tab-name">{{ item.name }}</span>
      </div>
    </div>
    <div class="tabs-wrapper" v-show="bujianListVisible">
      <div
          v-for="item in bujianItemList"
          :key="item.name"
          class="tab-item"
          @click="() => onClickTab(item)"
          :style="{backgroundImage: activeTabList.find(tab => tab.name === item.name)? `url(${item.imageActiveName})`:`url(${item.imageName})` , backgroundSize:'100% 100%'}"
      >
        <span class="tab-name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-bar-wrapper {
  height: 500px;
  z-index: 10;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  padding-left: 12px;

  .controller {
    display: flex;
    padding: 12px 12px;
    background: url("../assets/images/tab-control-bg.png") no-repeat;
    align-items: center;
    background-size: cover;
    justify-content: center;
    width: 144px;
    cursor: pointer;
    margin-bottom: 32px;

    > span {
      margin-left: 12px;
    }
  }

  .tabs-wrapper {
    margin-left: 32px;
    height: 600px;
    overflow: auto;

    .tab-item {
      width: 156px;
      height: 43px;
      position: relative;
      margin: 20px 0;
      cursor: pointer;
      white-space: nowrap;

      .tab-name {
        position: absolute;
        left: 68px;
        top: 8px;
      }
    }
  }
}
</style>
