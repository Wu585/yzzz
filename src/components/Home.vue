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
import ViewManagePanel from "./ViewManagePanel.vue";
import RangeQueryPanel from "./RangeQueryPanel.vue";
import axios from "axios";

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

})

</script>

<template>
  <div>
    <Scene/>
    <Header/>
    <SideBar/>
    <TabDataPanel
        v-show="store.tabDataPanelVisible"
        :title="store.tabDataTitle"
        :dataSource="store.tabDataList"
        @close="() => store.setTabDataPanelVisible(false)"
    />
    <RangeQueryPanel v-if="store.rangeQueryPanelVisible" @close="() => store.setRangeQueryPanelVisible(false)"/>
    <ToolBar/>
    <ViewManagePanel v-show="store.viewPanelVisible"/>
    <div class="query-list-icon" @click="() => store.setTabDataPanelVisible(true)"></div>
    <div class="left-lay"/>
    <div class="right-lay"/>
    <div class="top-lay"/>
  </div>

  <div id="bubble-container" class="bubble-container" ref="bubbleQuery" v-show="store.bubbleVisible">
    <iframe id="bubble-frame" name="bubble-frame" class="iframe" :src="store.iframeUrl" frameborder="0"></iframe>
    <div class="close" @click="store.setBubbleVisible(false)">×</div>
  </div>
  <div id="hover-bubble-container" class="hover-bubble-container" v-show="store.hoverBubbleVisible">
    {{ store.currentHoverEntityName }}
  </div>
</template>

<style lang="scss" scoped>
.query-list-icon {
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
  width: 800px;
  min-height: 350px;
}

.close {
  position: absolute;
  font-size: 32px;
  right: 12px;
  top: 4px;
  cursor: pointer;
  color: white;
}

.bubble-container {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.hover-bubble-container {
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -175%);
  background: #2A4F81;
  color: white;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
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
