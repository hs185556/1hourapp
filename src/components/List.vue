<template>
  <div class="listWrap card">
    <el-collapse
      v-model="activeName"
      @change="setLocalActive"
      class="collapseWrap"
    >
      <el-collapse-item
        v-for="item in listData"
        :key="item.id"
        :title="item.title"
        :name="item.source"
      >
        <template #title>
          <div
            class="flex flex-row flex-justify-between flex-items-center w100 pr16"
          >
            {{
              item.title +
              (item.data.length ? "（" + item.data.length + "）" : "")
            }}
            <el-icon
              class="primary-color f18"
              @click.stop.prevent="handleAddData(item.source)"
            >
              <Plus />
            </el-icon>
          </div>
        </template>
        <div class="listInner" :data-id="item.source">
          <div
            v-for="(item1, index1) in item.data"
            :key="item1.id"
            :data-id="item1.sort"
          >
            <ListItem
              v-model:value="item.data[index1]"
              :source="item.source"
              @del="handleDelData"
              @save="saveData"
            />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import { Plus } from "@element-plus/icons-vue";
import ListItem from "./ListItem.vue";

const props = defineProps({
  listData: Array,
});

const emit = defineEmits(["addData", "updateData", "delData"]);

const activeName = ref(JSON.parse(localStorage.getItem("activeName")) || [0]);

const setLocalActive = (name) => {
  localStorage.setItem("activeName", JSON.stringify(name));
};

const handleAddData = (source) => {
  emit("addData", toRaw(source));
};

const handleDelData = (source, index) => {
  emit("delData", source, index);
};

const saveData = (data) => {
  emit("updateData", toRaw(data));
};
</script>
<style scoped>
::v-deep .el-icon.el-collapse-item__arrow {
  font-size: 18px;
}
</style>
