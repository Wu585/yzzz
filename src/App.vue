<script setup>
import {useStore} from "./store/index.js";

const store = useStore()

</script>

<template>
  <div class="app">
    <RouterView/>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  position: relative;
}
</style>
