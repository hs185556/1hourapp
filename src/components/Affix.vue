<template>
  <div class="affixWrap">
    <el-icon ref="buttonRef" class="f18">
      <Menu />
    </el-icon>
  </div>

  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    virtual-triggering
    trigger="click"
    title=""
    placement="bottom-end"
    width="235"
  >
    <el-button
      :type="vConsoleInstance ? 'primary' : 'info'"
      link
      @click="toggleVConsole"
    >
      VConsole
    </el-button>
    <el-button type="primary" link @click="emit('export')">导出</el-button>
    <el-button type="primary" link @click="emit('import')">导入</el-button>
    <el-button type="primary" link @click="emit('moveToPool')">进池</el-button>
  </el-popover>
</template>

<script setup>
import VConsole from "vconsole";
import { ref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { Menu } from "@element-plus/icons-vue";

const emit = defineEmits(["export", "import", "moveToPool"]);

const buttonRef = ref(null);
const popoverRef = ref(null);

let vConsoleInstance = ref(null);
function toggleVConsole() {
  if (!vConsoleInstance.value) {
    vConsoleInstance.value = new VConsole();
  } else {
    vConsoleInstance.value.destroy();
    vConsoleInstance.value = null;
  }
}
</script>

<style scoped>
.affixWrap {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  height: 18px;
  padding: 13px 8px;
}
</style>
