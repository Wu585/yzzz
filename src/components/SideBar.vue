<script setup>
import {getImageUrl} from "../utils/getImage.js";
import {onMounted, ref} from "vue";
import {useStore} from "../store/index.js";
import {http} from "../utils/http.js";
import {useRoute} from "vue-router";
import {dataHttp, getVideoList} from "../utils/request.js";
import {findLayer, findMapLayer} from "../utils/layer.js";

// 侧边栏一级菜单列表
const tabItemList = ref([])

// 侧边栏二级菜单列表
const secondTabList = ref([])

onMounted(async () => {
  const {id} = useRoute().query

  // 后台返回的图例数据
  const res = await http.get("/front/getByTemplateId", {
    templateId: id
  })

  console.log('res2====xxx====');
  console.log(res.data);

  // 所有图例数据
  tabItemList.value = res.data.filter(tab => tab.legendStatus)
})

const store = useStore()

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
  if (tab.children?.length > 0) {
    secondTabList.value = tab.children.filter(item => item.secondaryStatus)
    store.setSideBarStatusText("上一级")
    bujianListVisible.value = true
    tabListVisible.value = false
    return
  }

  const type = tab.legendType
  const legendName = tab.legendName
  const secondName = tab.name

  const name = legendName || secondName
  console.log('name');
  console.log(name);

  const clickItem = store.selectedTabs.find(item => item.name === name)
  console.log('clickItem');
  console.log(clickItem);
  if (clickItem) {
    store.selectedTabs.splice(store.selectedTabs.indexOf(clickItem), 1)
    store.setTabDataTitle(store.selectedTabs[store.selectedTabs.length - 1]?.name || "")

    if (type === "3D") {
      const layer = findLayer(legendName)
      layer.visible = false
      return
    } else if (type === "MAP") {
      findMapLayer(legendName).show = false
      return
    } else {
      window[name].entitiesArray?.forEach(entity => {
        viewer.entities.remove(entity)
      })
      window[name].entitiesArray = []
    }

    return
  }

  store.selectedTabs = [...store.selectedTabs, {...tab, name}]
  console.log('store.selectedTabs');
  console.log(store.selectedTabs);
  if (type === "3D") {
    const layer = findLayer(legendName)
    layer.visible = true
    viewer.flyTo(layer)
  } else if (type === "MAP") {
    const layer = findMapLayer(legendName)
    console.log("MAP============");
    console.log(layer);
    findMapLayer(legendName).show = true
  } else {
    store.setTabDataPanelVisible(true)
    store.setTabDataTitle(name)
    const dataUrl = window[name]?.url

    /*if (!window[name].dataList) {
      window[name].dataList = (await dataHttp.get(dataUrl)).data.data
    }*/
  }
}

/*const onClickTab1 = async (tab) => {
  console.log('tab');
  console.log(tab);

  const type = tab.legendType
  const legendName = tab.legendName

  let clickItem

  if (tab.legendName) {
    // clickItem = activeTabList.value.find(item => tab.legendName === item.legendName)
    clickItem = store.selectedTabs.find(item => tab.legendName === item.legendName)
  } else {
    // clickItem = activeTabList.value.find(item => tab.name === item.name)
    clickItem = store.selectedTabs.find(item => tab.name === item.name)
  }

  console.log('clickItem');
  console.log(clickItem);

  if (tab.legendName === "部件") {
    store.setSideBarStatusText("上一级")
    bujianListVisible.value = true
    tabListVisible.value = false
  } else if (clickItem) {
    store.setTabDataPanelVisible(false)
    store.selectedTabs.splice(store.selectedTabs.indexOf(clickItem), 1)

    if (type === "3D") {
      console.log("---here---")
      const layer = findLayer(legendName)
      layer.visible = false
      return
    } else if (type === "MAP") {
      findMapLayer(legendName).show = false
      return
    }

    // activeTabList.value.splice(activeTabList.value.indexOf(clickItem), 1)
    if (clickItem.legendName) {
      window[clickItem.legendName].entitiesArray?.forEach(entity => {
        viewer.entities.remove(entity)
      })
      window[clickItem.legendName].entitiesArray = []
    } else if (clickItem.name) {
      console.log("remove2")
      window[clickItem.legendName].entitiesArray?.forEach(entity => {
        viewer.entities.remove(entity)
      })
      window[clickItem.legendName].entitiesArray = []
    }

    store.setTabDataPanelVisible(false)
  } else {
    store.selectedTabs = [...store.selectedTabs, tab]
    console.log('store.selectedTabs');
    console.log(store.selectedTabs);
    console.log('map[tab.legendName]');
    console.log(map[tab.legendName]);

    if (type === "3D") {
      const layer = findLayer(legendName)
      layer.visible = true
      viewer.flyTo(layer)
      return
    } else if (type === "MAP") {
      const layer = findMapLayer(legendName)
      console.log("MAP============");
      console.log(layer);
      findMapLayer(legendName).show = true
      return
    }

    if (map[tab.legendName] || map[tab.name]) {
      store.setTabDataPanelVisible(true)
      if (map[tab.legendName]?.title) {
        // store.setTabDataTitle(map[tab.legendName]?.title)
        store.setTabDataTitle(legendName)
        store.setDynamicComponentProps({
          title: map[tab.legendName]?.title
        })
      } else {
        // store.setTabDataTitle(map[tab.name].title)
        store.setTabDataTitle(legendName)
        store.setDynamicComponentProps({
          title: map[tab.name]?.title
        })
      }
      /!*const data = (await map[tab.name].data()).data.data
      console.log(data);
      store.setTabDataList(data)*!/
    }

  }
}*/

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
          :key="item.id"
          class="tab-item"
          @click="() => onClickTab(item)"
          :style="{backgroundImage: store.selectedTabs.find(tab => tab.legendName === item.legendName)? `url(${getImageUrl('tab-item-bg-active')})`:`url(${getImageUrl('tab-item-bg')})` , backgroundSize:'100% 100%'}"
      >
        <span class="tab-name">{{ item.legendName }}</span>
      </div>
    </div>
    <div class="tabs-wrapper" v-show="bujianListVisible">
      <div
          v-for="item in secondTabList"
          :key="item.name"
          class="tab-item"
          @click="() => onClickTab(item)"
          :style="{backgroundImage: store.selectedTabs.find(tab => tab.name === item.name)? `url(${getImageUrl('tab-item-bg-active')})`:`url(${getImageUrl('tab-item-bg')})`, backgroundSize:'100% 100%'}"
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
    height: 530px;
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
