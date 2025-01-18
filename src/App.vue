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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
