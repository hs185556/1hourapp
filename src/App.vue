<template>
  <div class="app">
    <Header></Header>
    <Main></Main>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
