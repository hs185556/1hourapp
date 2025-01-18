<template>
  <div class="listItemWrap mb8 flex flex-items-center g8">
    <el-icon class="move f20 mr8"><Operation /></el-icon>
    <el-checkbox
      label=""
      v-model="modelData.isDone"
      v-if="source === 0"
      @change="emits('save', modelData)"
    />
    <el-input
      type="text"
      v-model="modelData.content"
      class="flex-1"
      @change="emits('save', modelData)"
    />
    <el-icon
      class="warning-color f18"
      @click="emits('del', source, modelData.sort)"
    >
      <Delete />
    </el-icon>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Delete, Operation } from "@element-plus/icons-vue";

const props = defineProps({
  value: Object,
  source: Number,
});
const emits = defineEmits(["update:value", "del", "save"]);
const modelData = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("update:value", val);
  },
});

function delay(fn) {
  let timer;
  clearTimeout(timer);
  timer = setTimeout(fn, 300);
}
</script>

<style scoped></style>
