<script setup>
import {useStore} from "../store/index.js";

const emit = defineEmits(['close'])
const store = useStore()

const onClose = () => {
  emit('close')
  store.setCurrentDynamicComponent(null)
}
</script>

<template>
  <div class="panel-wrapper">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div @click="onClose" class="close">
      ×
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-wrapper {
  min-width: 580px;
  min-height: 500px;
  position: absolute;
  z-index: 10;
  right: 50%;
  top: 50%;
  transform: translate(70%,-50%);
  background: url("../assets/images/dynamic-component-bg.png") no-repeat;
  background-size: 100% 100%;
  color: white;
  display: flex;
  flex-direction: column;

  .title {
    padding: 12px 40px;
    font-size: 18px;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 6px;
    font-size: 32px;
    cursor: pointer;
  }

  .content {
    height: 100%;
    padding: 16px;
  }
}
</style>
