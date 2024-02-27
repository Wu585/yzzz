<script setup>
import DynamicComponentLayout from "./DynamicComponentLayout.vue";
import SpanLine from "./SpanLine.vue";
import DoubleSpanLine from "./DoubleSpanLine.vue";
import {onMounted} from "vue";
import {useStore} from "../store/index.js";

const store = useStore()

const props = defineProps(['dataSource'])

onMounted(() => {
  console.log('props.dataSource')
  console.log(props.dataSource)
})
</script>

<template>
  <DynamicComponentLayout>
    <template #title>
      <span>{{props.dataSource?.rawText || ""}}</span>
    </template>
    <template #default>
      <SpanLine title="监控名称" :content="props.dataSource?.monitorName"/>
      <DoubleSpanLine :contentArray="[
          {title:'设备类型',content: '0'},
          {title:'行政区域',content: 'xxx'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'经纬度',content: '0'},
          {title:'是否已核查',content: 'xxx'}
      ]"/>
      <div class="video-wrapper">
        <div class="video-container">

        </div>
      </div>
    </template>
  </DynamicComponentLayout>
</template>

<style lang="scss" scoped>
.line-item {
  display: flex;
  margin-top: 8px;

  .item {
    flex-basis: 50%;
    flex-grow: 1;
  }
}

.video-wrapper {
  border: 2px solid #2D72D9;
  margin-top: 24px;
  height: 240px;
  padding: 12px;

  .video-container {
    background: black;
    height: 100%;
  }
}
</style>
