<script setup>
import DoubleSpanLine from "./DoubleSpanLine.vue";
import DynamicComponentLayout from "./DynamicComponentLayout.vue";
import SpanLine from "./SpanLine.vue";
</script>

<template>
  <DynamicComponentLayout>
    <template #title>
      <span>工单1</span>
    </template>
    <template #default>
      <DoubleSpanLine :contentArray="[
          {title:'事件名称',content: '事件1'},
          {title:'坐标',content: 'xxx'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'事件类型',content: '0'},
          {title:'联系人',content: '张三'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'发现时间',content: '2024.01.22'},
          {title:'联系方式',content: '18827338929'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'发现地址',content: '********'},
          {title:'问题描述',content: '********'}
      ]"/>
      <DoubleSpanLine :contentArray="[
          {title:'所属村组',content: '4组'},
          {title:'状态',content: 'xxx'}
      ]"/>
      <div class="timeline-wrapper">
        <div class="header">
          事件事件线
        </div>
        <div class="details">
          <div class="flow">
            <el-steps direction="vertical" :active="4">
              <el-step title="发现事件"/>
              <el-step title="受理事件"/>
              <el-step title="处理审核"/>
              <el-step title="事件完成"/>
            </el-steps>
          </div>
          <div class="description">
            <SpanLine class="mb" title="发现时间" content="2024.01.22"/>
            <SpanLine class="mb" title="发现人" content="莉丝"/>
            <SpanLine class="mb" title="联系方式" content="19288388899"/>
            <SpanLine class="mb" title="事件描述" content="********"/>
          </div>
        </div>
      </div>
    </template>
  </DynamicComponentLayout>
</template>

<style lang="scss" scoped>
.mb {
  margin-bottom: 8px;
}

.timeline-wrapper {
  width: 100%;
  height: 266px;
  background: rgba(22, 47, 81, 1);
  display: flex;
  flex-direction: column;

  .header {
    border-bottom: 1px solid #2A4F81;
    padding: 8px 12px;
  }

  .details {
    height: auto;
    flex: 1;
    display: flex;
    padding: 8px 0;

    .flow {
      width: 120px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .description {
      padding:0 12px;
      flex: 1;
    }
  }
}
</style>
