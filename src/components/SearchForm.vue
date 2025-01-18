<template>
  <div class="searchWrap card">
    <el-date-picker
      v-model="searchForm.date1"
      type="date"
      placeholder="请选择"
      style="width: 100%"
      value-format="YYYY-MM-DD"
      @change="emit('search')"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  searchForm: Object,
});

const emit = defineEmits(["search"]);
</script>

<style scoped>
.searchWrap {
  padding: 8px;
  border-radius: 8px;
}
</style>
