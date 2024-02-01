<script setup>
import {onMounted, ref} from "vue";
import {getImageUrl} from "../utils/getImage.js";
import {http} from "../utils/http.js";

const toolList = ref([
  {
    name: "点选查询",
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
    name: "量算工具",
    imageName: getImageUrl("measure"),
    childrenVisible: false,
    children: [
      {
        name: "距离量算",
        imageName: getImageUrl("distanceMeasurement"),
      },
      {
        name: "面积量算",
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
    name: "清除",
    imageName: getImageUrl("sceneRoaming")
  },
])

onMounted(async () => {
  const res1 = await http.get("/templateConfig/get", {
    id: "1752519872051982338"
  })
  console.log('res1');
  console.log(res1);

  const toolbarStatus = JSON.parse(res1.data.toolbarStatus)
  console.log('toolbarStatus');
  console.log(toolbarStatus);

  const res2 = await http.get("/toolbarConfig/getTree")
  console.log('res2');
  console.log(res2);

  toolList.value = res2.data.filter(item => {
    if (item.children.length > 0) {
      item.children = item.children.filter(child => {
        return toolbarStatus.indexOf(child.id) >= 0
      })
    }
    return toolbarStatus.indexOf(item.id) >= 0
  })

  console.log('toolList.value');
  console.log(toolList.value);

  toolList.value.map(item => ({
    ...item,
    imageName: "clickToQuery",
  })).sort((a,b) => {
      return a-b
  })

  console.log(toolList.value);

})

const selectedTool = ref({
  toolName: ""
})

const childrenBarVisible = ref(false)

const onClickToolItem = (item) => {
  console.log('item');
  console.log(item);

  childrenBarVisible.value = false

  selectedTool.value = item

  if (item.children.length > 0) {
    childrenBarVisible.value = true
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
        <div v-for="childItem in item.children" :key="childItem.toolName" class="child-item">
          <!--          <img :src="childItem.imageName" alt="">-->
          <img :src="getImageUrl('clickToQuery')" alt="">
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
        <img :src="getImageUrl('clickToQuery')" alt="" @click="() => onClickToolItem(item)">
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

    .childrenBar {
      background: url("../assets/images/tool-children-bg.png") no-repeat;
      background-size: 100% 100%;
      width: 124px;
      position: absolute;
      right: 60px;
      transform: translateY(-30px);
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
