<template>
  <main class="main-container">
    <SearchForm :searchForm="searchForm" @search="getData" />
    <List
      :listData="listData"
      @addData="handleAddData"
      @updateData="handleUpdate"
      @delData="handleDelData"
    />
    <Affix
      @export="handleExport"
      @import="handleImport"
      @export2="handleExport2"
      @import2="handleImport2"
      @export3="handleExport2(searchForm.date1)"
      @moveToPool="moveToPoolData"
      @moveToPool2="moveToPoolData2"
    ></Affix>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, toRaw } from "vue";
import dayjs from "dayjs";
// import { v4 as uuidv4 } from "uuid";
import Sortable from "sortablejs";
import SearchForm from "./SearchForm.vue";
import Affix from "./Affix.vue";
import List from "./List.vue";
import {
  openTodo,
  getTodos,
  getAllTodos,
  getTodosByDate,
  addTodo,
  updateTodo,
  deleteTodo,
  batchDeleteTodos,
  clearTodos,
  batchAddOrUpdateTodos,
} from "@/controller/todoController";

const searchForm = reactive({
  date1: dayjs().format("YYYY-MM-DD"),
});

const listData = reactive([
  { title: "今日目标", source: 0, data: [] },
  { title: "任务池", source: 1, data: [] },
  { title: "长期目标", source: 2, data: [] },
]);

onMounted(async () => {
  await Promise.all([openTodo(), initSortable()]);
  await getData();
  console.log(">>>navigator.userAgent", navigator.userAgent);
});

async function getData() {
  const todoList = await getTodos(searchForm.date1);
  todoList.forEach((item, index) => {
    listData[index].data = item.data || [];
  });
}

function initSortable() {
  document.querySelectorAll(".listInner").forEach((el) => {
    new Sortable(el, {
      group: { name: "itxst.com", pull: true, put: true },
      handle: ".move",
      animation: 150,
      // delay: 200,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      // onChange: (event) => {
      //   //改变数据排序
      //   let template = this.tableData[event.oldIndex];
      //   //删掉之前的位置
      //   this.tableData.splice(event.oldIndex, 1);
      //   //新位置加一个
      //   this.tableData.splice(event.newIndex, 0, template);
      //   this.$forceUpdate();
      // },
      // onMove: (evt) => {
      //   console.log(
      //     "拖动中",
      //     evt.dragged.dataset.id,
      //     evt.related.dataset.id,
      //     evt
      //   );
      // },
      onEnd: async (evt) => {
        console.log("拖动结束", evt);
        const { oldIndex, newIndex } = evt;
        const oldSource = evt.from.dataset.id;
        const newSource = evt.to.dataset.id;
        console.log(`${oldSource}-${oldIndex} => ${newSource}-${newIndex}`);
        const template = listData[oldSource].data[oldIndex];
        listData[oldSource].data.splice(oldIndex, 1);
        listData[newSource].data.splice(newIndex, 0, template);
        sortData();
        listData[0].data.forEach((item) => (item.date = searchForm.date1));
        await saveData();
      },
    });
  });
}

function sortData() {
  listData.forEach((item) => {
    item.data.forEach((item1, index1) => {
      item1.sort = index1;
      item1.source = item.source;
    });
  });
}

function getNewData(source) {
  return {
    content: "",
    date: searchForm.date1,
    source,
  };
}

async function handleAddData(source) {
  listData[source].data.unshift(getNewData(source));
  sortData();
  await saveData();
  await getData();
}

async function handleUpdate(data) {
  await updateTodo(data);
}

async function handleDelData(source, index) {
  ElMessageBox.confirm("确认删除该项?", "警告", {
    type: "warning",
  }).then(() => {
    const [item] = listData[source].data.splice(index, 1);
    deleteTodo(item.id);
    sortData();
    saveData();
    ElMessage.success("删除成功");
  });
}

function saveData() {
  console.log("saveData", toRaw(listData.map((v) => toRaw(v.data)).flat()));
  batchAddOrUpdateTodos(toRaw(listData.map((v) => toRaw(v.data)).flat()));
}

// 进池
async function moveToPoolData() {
  // 删除未完成事项
  const unDoneData = listData[0].data.filter((v) => !v.isDone);
  listData[0].data = listData[0].data.filter((v) => v.isDone);
  await batchDeleteTodos(unDoneData.map((v) => v.id));

  // 添加进任务池
  const moveData = unDoneData.map((v) => {
    delete v.id;
    return v;
  });
  listData[1].data.unshift(...moveData);
  listData[1].data = listData[1].data.map((v) => ({ ...v, source: 1 }));

  // 排序保存
  sortData();
  await saveData();
  await getData();
  ElMessage.success("已成功将未完成事项移动到待办事项");
}

// 进第二天 TODO
async function moveToPoolData2() {
  // 删除未完成事项
  const unDoneData = listData[0].data.filter((v) => !v.isDone);
  listData[0].data = listData[0].data.filter((v) => v.isDone);
  await batchDeleteTodos(unDoneData.map((v) => v.id));
  // 添加进第二天的数据
  const moveData = unDoneData.map((v) => {
    delete v.id;
    return v;
  });
  // 查询第二天的数据
  const secondDayData = await getTodosByDate(
    dayjs(searchForm.date1).add(1, "day").format("YYYY-MM-DD"),
    (v) => v.source == 0
  );
  // 合并第二天的数据
  const mergeData = [...secondDayData, ...moveData];
  // 对第二天的数据排序
  const sortMergeData = mergeData.map((item1, index1) => {
    item1.sort = index1;
    return item1;
  });
  // 批量添加或者更新
  await batchAddOrUpdateTodos(sortMergeData);
  ElMessage.success("已成功将今天的未完成事项移动到第二天");
}

async function handleExport() {
  try {
    const allData = await getAllTodos();
    const blob = new Blob([JSON.stringify(allData)], {
      type: "text/plain", // 更改为纯文本类型
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `1hourapp_data_${dayjs().format("YYYY-MM-DD")}.xml`; // 更改为 .xml 扩展名
    link.click();
    URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
}

async function handleImport() {
  const dataBak = await getAllTodos();

  try {
    const input = document.createElement("input");
    input.type = "file";
    // input.accept = ".xml"; // 仅接受 .xml 文件
    input.onchange = async function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async function (event) {
        try {
          const data = JSON.parse(event.target.result); // 解析纯文本 JSON 内容
          await clearTodos();
          await batchAddOrUpdateTodos(data);
          await getData();
          ElMessage.success("导入成功");
        } catch (error) {
          console.error(error);
          ElMessage.error("导入失败，恢复备份数据");
          await batchAddOrUpdateTodos(dataBak);
        }
      };
      reader.readAsText(file); // 读取文件为纯文本
    };
    input.click();
  } catch (error) {
    console.error(error);
    ElMessage.error("导入失败，恢复备份数据");
    await batchAddOrUpdateTodos(dataBak);
  }
}

async function handleExport2(date) {
  const data = await getTodosByDate(date);
  const jsonString = JSON.stringify(data);

  const { value } = await ElMessageBox.prompt("导出数据", {
    confirmButtonText: "复制",
    cancelButtonText: "取消",
    inputType: "textarea",
    inputValue: jsonString,
  });

  // 创建一个隐藏的 textarea 元素
  const textarea = document.createElement("textarea");
  textarea.id = "hiddenTextarea";
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  // 将文本内容写入 textarea
  textarea.value = value;

  // 选择 textarea 中的文本
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  document.execCommand("copy");
  ElMessage.success("数据已复制到剪贴板");
}

async function handleImport2() {
  const { value: jsonString } = await ElMessageBox.prompt("导入数据", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputType: "textarea",
  });

  if (!jsonString) return;

  try {
    const data = JSON.parse(jsonString);
    await clearTodos();
    await batchAddOrUpdateTodos(data);
    await getData();
    ElMessage.success("导入成功");
  } catch (error) {
    console.error(error);
    ElMessage.error("导入失败，恢复备份数据");
    await batchAddOrUpdateTodos(dataBak);
  }
}
</script>

<style scoped>
.main-container {
  flex: 1;
  background: rgb(245, 244, 251);
  padding: 8px 8px 0 8px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}
.searchWrap {
}
.listWrap {
  flex: 1;
}
</style>

<style scoped>
::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
</style>
