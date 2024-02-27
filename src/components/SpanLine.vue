<script setup>
const props = defineProps(['title', 'content'])
</script>

<template>
  <div class="span-line-wrapper">
    <span class="title">{{ props.title }}:</span>
    <span class="content">{{ props.content }}</span>
  </div>
</template>

<style lang="scss" scoped>
.span-line-wrapper {
  display: flex;

  .title {
    white-space: nowrap;
    background: rgba(45, 114, 217, 1);
    width: 160px;
    padding: 8px;
  }

  .content {
    padding: 8px;
    background: rgba(21, 52, 93, 1);
    flex: 1;
  }
}
</style>
