<script setup>
import {onMounted, ref} from "vue";
import {getImageUrl} from "../utils/getImage.js";
import {http} from "../utils/http.js";
import {useStore} from "../store/index.js";
import {useRoute} from "vue-router";
import MonitorPanel from "./MonitorPanel.vue";
import * as tools from "../utils/tool.js"
import {boxSelectQuery, calcArea, calcDistance, clear, reset} from "../utils/tool.js";

const store = useStore()

const toolList = ref([])

const toolList1 = ref([
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
])

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

  toolList.value = res2.data.filter(item=>{
    return toolbarStatus.find(tool => tool === item.id)
  })

  console.log('toolList.value');
  console.log(toolList.value);

  /*toolList.value = res2.data.filter(item => {
    if (item.children.length > 0) {
      item.children = item.children.filter(child => {
        return toolbarStatus.indexOf(child.id) >= 0
      })
      return toolbarStatus.indexOf(item.id)
    }
    return toolbarStatus.indexOf(item.id) >= 0
  })

  toolList.value.map(item => {
    const x = toolList1.value.find(tool => tool.name === item.toolName)
    if (x) {
      item.imageName = x.imageName
    }
    if (item.children) {
      item.children.map(child => {
        const y = x.children.find(z => z.name === child.toolName)
        if (y) {
          child.imageName = y.imageName
        }
        return child
      })
    }
    return item
  }).sort((a, b) => {
    return a - b
  })

  console.log('toolList.value');
  console.log(toolList.value);*/
})

const selectedTool = ref({
  toolName: ""
})

const childrenBarVisible = ref(false)

const map = {
  "坐标拾取": "zbsq",
  "图层复位": "reset"
}

const onClickToolItem = (item) => {
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
}

const onClickChildItem = (item) => {
  const styleSelection = JSON.parse(item.styleSelection)
  console.log('styleSelection');
  console.log(styleSelection);

  const lineColor = styleSelection.find(x => x.name === "边框:").HEX
  const fillColor = styleSelection.find(x => x.name === "填充:").HEX

  if (item.toolName === "距离测量") {
    calcDistance(lineColor, fillColor)
  } else if (item.toolName === "面积测量") {
    calcArea()
  } else if (item.toolName === "框选查询") {
    boxSelectQuery(lineColor,fillColor)
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
          <img :src="childItem.imageName" alt="">
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
        <img :src="item.imageName" alt="" @click="() => onClickToolItem(item)">
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
