<script setup>
import {useStore} from "./store/index.js";
import Home from "./components/Home.vue";

const store = useStore()

</script>

<template>
  <div class="app">
    <Home/>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  position: relative;
}
</style>
