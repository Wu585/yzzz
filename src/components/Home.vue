<script setup>
import Scene from "./Scene.vue";
import Header from "./Header.vue";
import SideBar from "./SideBar.vue";
import TabDataPanel from "./TabDataPanel.vue";
import {useStore} from "../store/index.js";
import ToolBar from "./ToolBar.vue";
import {onMounted} from "vue";
import {http} from "../utils/http.js";
import {useRoute} from "vue-router";
import DynamicComponentLayout from "./DynamicComponentLayout.vue";
import MonitorPanel from "./MonitorPanel.vue";
import HousePanel from "./HousePanel.vue";
import WorkOrderPanel from "./WorkOrderPanel.vue";
import {getMonitorCheckList, getVideoList, getWC, getWorkOrderList, getWzK} from "../utils/request.js";
import ViewManagePanel from "./ViewManagePanel.vue";

const store = useStore()

const {id} = useRoute().query

onMounted(async () => {
  id && store.setTemplateId(id)

  const res = await http.post("login", {
    username: "test",
    password: "test"
  })

  localStorage.setItem("token", res.data.token)
})

onMounted(async () => {
  http.get("/front/getTree",{
    id
  }).then(res=>{
    console.log('res====res');
    console.log(res);
  })
})

</script>

<template>
  <div>
    <Scene/>
    <Header/>
    <SideBar/>
    <!--    <MonitorPanel/>-->
    <!--    <HousePanel/>-->
    <!--    <WorkOrderPanel/>-->
    <!--    <component class="dynamic" :is="store.currentDynamicComponent"></component>-->
    <TabDataPanel
        v-show="store.tabDataPanelVisible"
        :title="store.tabDataTitle"
        :dataSource="store.tabDataList"
        @close="() => store.setTabDataPanelVisible(false)"
    />
    <ToolBar/>
    <ViewManagePanel v-show="store.viewPanelVisible"/>
    <div class="query-list-icon" @click="() => store.setTabDataPanelVisible(true)"></div>
    <div class="left-lay"/>
    <div class="right-lay"/>
    <div class="top-lay"/>
  </div>

  <div id="bubble-container" class="bubble-container" ref="bubbleQuery" v-show="store.bubbleVisible">
    <!--    <component class="dynamic" :is="store.currentDynamicComponent"
                   :dataSource="store.dynamicComponentProps"></component>-->
    <iframe id="bubble-frame" name="bubble-frame" class="iframe" :src="store.iframeUrl" frameborder="0"></iframe>
  </div>
</template>

<style lang="scss" scoped>
.query-list-icon{
  width: 184px;
  height: 45px;
  position: absolute;
  left: -32px;
  bottom: 64px;
  background: url("../assets/images/chaxunliebiao.png");
  cursor: pointer;
  z-index: 99;
}

.iframe {
  width: 500px;
  height: 300px;
}

.bubble-container {
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -100%);
}

.top-lay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  background: linear-gradient(360deg, rgba(4, 21, 45, 0) 0%, #041326 100%);
  z-index: 9;
  height: 120px;
}

.left-lay {
  position: absolute;
  left: 0;
  top: 0;
  width: 280px;
  background: linear-gradient(270deg, rgba(4, 21, 45, 0) 0%, #041326 120%);
  z-index: 9;
  height: 100vh;
}

.right-lay {
  position: absolute;
  right: 0;
  top: 0;
  width: 160px;
  background: linear-gradient(90deg, rgba(4, 21, 45, 0) 0%, #041326 120%);
  z-index: 9;
  height: 100vh;
}
</style>
