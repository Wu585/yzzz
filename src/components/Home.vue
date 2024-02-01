<script setup>
import Scene from "./Scene.vue";
import Header from "./Header.vue";
import SideBar from "./SideBar.vue";
import TabDataPanel from "./TabDataPanel.vue";
import {useStore} from "../store/index.js";
import ToolBar from "./ToolBar.vue";
import {onMounted} from "vue";
import {http} from "../utils/http.js";

const store = useStore()

onMounted(async () => {
  const res = await http.post("login", {
    username: "admin",
    password: "admin"
  })
  localStorage.setItem("token", res.data.token)
})
</script>

<template>
  <div>
    <Scene/>
    <Header/>
    <SideBar/>
    <TabDataPanel
        v-if="store.tabDataPanelVisible"
        :title="store.tabDataTitle"
        :dataSource="store.tabDataList"
        @close="()=>store.setTabDataPanelVisible(false)"
    />
    <ToolBar/>
  </div>
</template>

<style lang="scss" scoped>
</style>
