<script setup>

import {ref} from "vue";

const props = defineProps(['title', 'dataSource'])

const emit = defineEmits(["close"])

const onClose = () => {
  emit("close")
}

const searchInput = ref("")

const page = ref(1)

</script>

<template>
  <div class="panel-wrapper">
    <div class="close" @click="onClose">×</div>
    <div class="title">{{ props.title }}</div>
    <div class="search">
      <el-input v-model="searchInput"/>
      <img src="../assets/images/searchIcon.png" alt="">
    </div>
    <div class="dataList">
      <div v-for="item in props.dataSource" :key="item.name" class="data-item">
        {{ item.name }}
      </div>
    </div>
    <div class="page-nation">
      <p> {{ "<<" }} </p>
      <div>
        <el-input v-model="page"/>
      </div>
      <p> {{ ">>" }} </p>
      <div class="option">
        1/15
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  height: 757px;
  position: absolute;
  left: 280px;
  top: 150px;
  z-index: 10;
  background: url("../assets/images/tab-data-panel-bg.png") no-repeat;
  background-size: 100% 100%;
  color: white;
  padding: 0 18px;

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

  .dataList {
    .data-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      padding: 12px;
      cursor: pointer;
    }
  }

  .page-nation {
    position: absolute;
    bottom: 32px;
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
      width: 32px;
    }
  }
}
</style>
