<script setup>
import {getImageUrl} from "../utils/getImage.js";
import {onMounted, ref} from "vue";
import {useStore} from "../store/index.js";
import {http} from "../utils/http.js";
import {useRoute} from "vue-router";
import {getVideoList} from "../utils/request.js";

const tabItemList1 = ref([])

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

const bujianItemList1 = ref([])

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
  const {id} = useRoute().query

  // 所有图例数据
  const res1 = await http.get("/legendInfo/queryAll")

  console.log('========res1========');
  console.log(res1.data);

  tabItemList.value.map(tab => {
    tab.id = res1.data.find(item => item.legendName === tab.name)?.id
    tab.sort = res1.data.find(item => item.legendName === tab.name)?.sort
    tab.secondaryColumn = res1.data.find(item => item.legendName === tab.name)?.secondaryColumn
    return tab
  })

  console.log('tabItemList.value');
  console.log(tabItemList.value);

  // 后台返回的图例数据
  const res2 = await http.get("/templateConfig/get", {
    id
  })

  const legendStatus = JSON.parse(res2.data.legendStatus)

  console.log('legendStatus');
  console.log(legendStatus);

  tabItemList1.value = res1.data.filter(tab => {
    return legendStatus.find(item => item.id === tab.id).checked
  })

  tabItemList1.value = tabItemList1.value.map(tab => {
    const x = tabItemList.value.find(item => tab.legendName === item.name)
    if (x) {
      tab.imageName = x.imageName
      tab.imageActiveName = x.imageActiveName
    }
    return tab
  }).sort((a, b) => {
    return a.sort - b.sort
  })

  console.log('tabItemList1.value');
  console.log(tabItemList1.value);

  /*tabItemList.value = tabItemList.value.filter(tab => {
    const des = legendStatus.find(item => item.id === tab.id)
    return des?.checked
  }).sort((a, b) => {
    return a.sort - b.sort
  })*/

  bujianItemList1.value = JSON.parse(tabItemList1.value.find(item => item.legendName === "部件")?.secondaryColumn)

  console.log('bujianItemList1.value');
  console.log(bujianItemList1.value);

  bujianItemList1.value = bujianItemList1.value.map(item => ({
    ...item,
    imageName: getImageUrl("qingxie"),
    imageActiveName: getImageUrl("qingxie-active")
  })).filter(item => item.isEnable)
})

const store = useStore()

const map = {
  "人房": {
    title: "人房列表",
  },
  "监控": {
    title: "监控列表",
    nameKey: "captureName",
    data: getVideoList
  },
  "监控核查": {
    title: "监控核查列表",
    data: getVideoList
  },
  "工单": {
    title: "工单列表",
  },
  "公共厕所": {
    title: "公共厕所",
  },
  "物资库": {
    title: "物资库",
  },
  "图书馆": {
    title: "图书馆",
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

const onClickTab = async (tab) => {
  console.log('tab');
  console.log(tab);
  let clickItem1

  if (tab.legendName) {
    // clickItem = activeTabList.value.find(item => tab.legendName === item.legendName)
    clickItem1 = store.selectedTabs.find(item => tab.legendName === item.legendName)
  } else {
    // clickItem = activeTabList.value.find(item => tab.name === item.name)
    clickItem1 = store.selectedTabs.find(item => tab.name === item.name)
  }

  console.log('clickItem1');
  console.log(clickItem1);

  if (tab.legendName === "部件") {
    store.setSideBarStatusText("上一级")
    bujianListVisible.value = true
    tabListVisible.value = false
  } else if (clickItem1) {
    store.setTabDataPanelVisible(false)

    // activeTabList.value.splice(activeTabList.value.indexOf(clickItem), 1)
    store.selectedTabs.splice(store.selectedTabs.indexOf(clickItem1), 1)
    if (clickItem1.legendName) {
      console.log("remove1")
      console.log('window.entitiesArrayMap');
      console.log(window.entitiesArrayMap);
      console.log('window.entitiesArrayMap[clickItem1.legendName]');
      console.log(window.entitiesArrayMap[clickItem1.legendName]);
      window.entitiesArrayMap[clickItem1.legendName]?.forEach(entity => {
        viewer.entities.remove(entity)
      })
      window.entitiesArrayMap[clickItem1.legendName] = []
    } else if (clickItem1.name) {
      console.log("remove2")
      window.entitiesArrayMap[clickItem1.name]?.forEach(entity => {
        viewer.entities.remove(entity)
      })
      window.entitiesArrayMap[clickItem1.name] = []
    }

    store.setTabDataPanelVisible(false)
  } else {
    store.selectedTabs = [...store.selectedTabs, tab]
    console.log('store.selectedTabs');
    console.log(store.selectedTabs);
    console.log('map[tab.legendName]');
    console.log(map[tab.legendName]);

    if (map[tab.legendName] || map[tab.name]) {
      store.setTabDataPanelVisible(true)
      if (map[tab.legendName]?.title) {
        store.setTabDataTitle(map[tab.legendName]?.title)
        store.setDynamicComponentProps({
          title: map[tab.legendName]?.title
        })
      } else {
        store.setTabDataTitle(map[tab.name].title)
        store.setDynamicComponentProps({
          title: map[tab.name]?.title
        })
      }
      /*const data = (await map[tab.name].data()).data.data
      console.log(data);
      store.setTabDataList(data)*/
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
          v-for="item in tabItemList1"
          :key="item.id"
          class="tab-item"
          @click="() => onClickTab(item)"
          :style="{backgroundImage: store.selectedTabs.find(tab => tab.legendName === item.legendName)? `url(${item.imageActiveName})`:`url(${item.imageName})` , backgroundSize:'100% 100%'}"
      >
        <span class="tab-name">{{ item.legendName }}</span>
      </div>
    </div>
    <div class="tabs-wrapper" v-show="bujianListVisible">
      <div
          v-for="item in bujianItemList1"
          :key="item.name"
          class="tab-item"
          @click="() => onClickTab(item)"
          :style="{backgroundImage: store.selectedTabs.find(tab => tab.name === item.name)? `url(${item.imageActiveName})`:`url(${item.imageName})` , backgroundSize:'100% 100%'}"
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
