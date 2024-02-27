<script setup>
import SpanLine from "./SpanLine.vue";

const props = defineProps({
  contentArray: Array
})
</script>

<template>
  <div class="line-item">
    <SpanLine
        class="item"
        v-for="item in props.contentArray"
        :key="item.title"
        :title="item.title"
        :content="item.content"/>
  </div>
</template>

<style lang="scss" scoped>
.line-item {
  display: flex;
  margin-bottom: 8px;

  .item {
    flex-basis: 50%;
    flex-grow: 1;
  }
}
</style>

