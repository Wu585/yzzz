<script setup>
import {onMounted, ref} from "vue";
import {useStore} from "../store/index.js";
import {addView, deleteV, getViewList, patchView} from "../utils/request.js";
import {flyToView} from "../utils/view.js";

const store = useStore()

const viewList = ref([])

const refresh = async () => {
  const res = await getViewList()
  console.log('view===========');
  console.log(res.data);
  viewList.value = res.data
}

onMounted(async () => {
  await refresh()
})


const getCameraParam = () => {
  const cameraX = viewer.camera.position.x;
  const cameraY = viewer.camera.position.y;
  const cameraZ = viewer.camera.position.z;
  const cameraPitch = viewer.camera.pitch;
  const cameraHeading = viewer.camera.heading;
  const cameraRoll = viewer.camera.roll;
  return {
    cameraX,
    cameraY,
    cameraZ,
    cameraPitch,
    cameraHeading,
    cameraRoll
  };
}

const onAdd = async () => {
  const {cameraX, cameraY, cameraZ, cameraPitch, cameraHeading, cameraRoll} = getCameraParam()
  await addView({
    "cameraPerspectiveHeading": cameraHeading,
    "cameraPerspectivePitch": cameraPitch,
    "cameraPerspectiveRoll": cameraRoll,
    "cameraPerspectiveX": cameraX,
    "cameraPerspectiveY": cameraY,
    "cameraPerspectiveZ": cameraZ,
    // "cameraPerspectiveName": "",
  })
  await refresh()
}

const editView = async (item) => {
  console.log('item');
  console.log(item);
  const {cameraX, cameraY, cameraZ, cameraPitch, cameraHeading, cameraRoll} = getCameraParam()
  await patchView({
    "cameraPerspectiveHeading": cameraHeading,
    "cameraPerspectivePitch": cameraPitch,
    "cameraPerspectiveRoll": cameraRoll,
    "cameraPerspectiveX": cameraX,
    "cameraPerspectiveY": cameraY,
    "cameraPerspectiveZ": cameraZ,
  })
  await refresh()
}

const flyView = (item) => {
  console.log(item);
  const {
    cameraPerspectiveX,
    cameraPerspectiveY,
    cameraPerspectiveZ,
    cameraPerspectiveHeading,
    cameraPerspectivePitch,
    cameraPerspectiveRoll
  } = item
  flyToView(cameraPerspectiveX, cameraPerspectiveY, cameraPerspectiveZ, cameraPerspectiveHeading, cameraPerspectivePitch, cameraPerspectiveRoll)
}

const deleteView = async (item) => {
  const id = item.cameraPerspectiveId
  console.log('id');
  console.log(id);
  await deleteV({
    ids: [+id]
  })
  await refresh()
}

</script>

<template>
  <div class="panel-wrapper">
    <div class="header">
      <div class="title">视点管理</div>
      <div class="close" @click="() => store.setViewPanelVisible(false)">×</div>
    </div>
    <div class="content">
      <div v-for="item in viewList" :key="item.cameraPerspectiveId" class="view-item-wrapper">
        <div class="view-item">

        </div>
        <div class="actions">
          <img src="../assets/images/edit-view.png" @click="() => editView(item)" alt="">
          <img src="../assets/images/fly-view.png" @click="() => flyView(item)" alt="">
          <img src="../assets/images/delete-view.png" @click="() => deleteView(item)" alt="">
        </div>

      </div>
      <div class="view-item-wrapper">
        <div class="view-item" @click="onAdd">
          <img src="../assets/images/add-view.png" alt="">
          <div :style="{paddingBottom:'16px'}">
            点击新增
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-wrapper {
  width: 512px;
  height: 243px;
  position: absolute;
  bottom: 250px;
  right: 120px;
  z-index: 10;
  background: url("../assets/images/view-manage-bg.png") no-repeat;
  background-size: 100% 100%;
  color: white;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    padding: 12px 36px;

    .title {

    }

    .close {
      position: absolute;
      right: 16px;
      font-size: 36px;
      top: 0;
      cursor: pointer;
    }
  }

  .content {
    flex: 1;
    padding: 24px;
    display: flex;

    .view-item-wrapper {
      display: flex;
      flex-direction: column;

      .view-item {
        width: 94px;
        height: 114px;
        background: rgba(15, 35, 66, 1);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        &:not(:last-child) {
          margin-right: 27px;
        }

        > img {
          width: 80px;
          height: 100px;
        }
      }

      .actions {
        padding-left: 4px;
        padding-top: 8px;

        > img {
          margin: 0 2px;
          cursor: pointer;
        }
      }
    }


  }
}
</style>
