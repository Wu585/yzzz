<script setup>
import DynamicComponentLayout from "./DynamicComponentLayout.vue";
import DoubleSpanLine from "./DoubleSpanLine.vue";
import SpanLine from "./SpanLine.vue";
import {useStore} from "../store/index.js";

const store = useStore()

const props = defineProps(['dataSource'])
</script>

<template>
  <DynamicComponentLayout>
    <template #title>
      <span>{{ props.dataSource?.rawText || "" }}</span>
    </template>
    <template #default>
      <SpanLine class="mb" title="名称" :content="props.dataSource.bujianName"/>
      <DoubleSpanLine :contentArray="[
          {title:'区县',content: '0'},
          {title:'乡镇',content: 'xxx'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'村社区',content: '0'},
          {title:'是否已核查',content: 'xxx'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'上报人',content: '0'},
          {title:'枪机数量',content: 'xxx'}
      ]"/>
      <SpanLine class="mb" title="上报时间" content="物资1"/>
      <SpanLine class="mb" title="详细地址" content="物资1"/>
      <SpanLine class="mb" :style="{height:'120px'}" title="核查图片" content=""/>
    </template>
  </DynamicComponentLayout>
</template>

<style lang="scss" scoped>
.mb {
  margin-bottom: 8px;
}
</style>
