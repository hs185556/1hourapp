<template>
  <div class="searchWrap card">
    <!-- @visible-change="delayDebug()" -->
    <el-date-picker
      readonly
      ref="datePicker"
      v-model="searchForm.date1"
      type="date"
      placeholder="请选择"
      style="width: 100%"
      value-format="YYYY-MM-DD"
      :clearable="false"
      @change="emit('search')"
    />
    <!-- 添加透明覆盖层 -->
    <div class="overlay" @click="openDatePicker"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  searchForm: Object,
});
const emit = defineEmits(["search"]);

const datePicker = ref(null);

function openDatePicker() {
  if (datePicker.value) {
    datePicker.value.handleOpen();
  }
}

function delayDebug() {
  setTimeout(() => {
    debugger;
  }, 1000);
}
</script>

<style scoped>
.searchWrap {
  padding: 8px;
  border-radius: 8px;
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1; /* 确保覆盖层位于日期选择器之上 */
}
</style>
