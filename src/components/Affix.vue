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
    width="100"
  >
    <el-button
      :type="vConsoleInstance ? 'primary' : 'info'"
      link
      @click="toggleVConsole"
    >
      VConsole
    </el-button>
    <br />
    <el-button type="primary" link @click="emit('import')">
      文件导入
    </el-button>
    <br />
    <el-button type="primary" link @click="emit('export')">
      文件导出
    </el-button>
    <br />
    <el-button type="primary" link @click="emit('import2')">
      文本导入
    </el-button>
    <br />
    <el-button type="primary" link @click="emit('export2')">
      文本导出
    </el-button>
    <br />
    <el-button type="primary" link @click="emit('export3')">导出当前</el-button>
    <br />
    <el-button type="primary" link @click="emit('moveToPool')">
      进池
    </el-button>
    <!-- <br />
    <el-button type="primary" link @click="emit('moveToPool2')">
      进第二天
    </el-button> -->
  </el-popover>
</template>

<script setup>
import VConsole from "vconsole";
import { ref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { Menu } from "@element-plus/icons-vue";

const emit = defineEmits([
  "export",
  "import",
  "moveToPool",
  "import2",
  "export2",
  "export3",
  "moveToPool2",
]);

const buttonRef = ref(null);
const popoverRef = ref(null);

let vConsoleInstance = ref(null);

function toggleVConsole() {
  if (!vConsoleInstance.value) {
    vConsoleInstance.value = new VConsole();
    localStorage.setItem("vConsoleEnabled", "true");
  } else {
    vConsoleInstance.value.destroy();
    vConsoleInstance.value = null;
    localStorage.removeItem("vConsoleEnabled");
  }
}

// 初始化时检查本地存储并恢复状态
if (localStorage.getItem("vConsoleEnabled") === "true") {
  vConsoleInstance.value = new VConsole();
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
