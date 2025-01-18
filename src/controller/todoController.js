import todoService from "@/service/todoService";

export const openTodo = async function () {
  await todoService.openTodo();
};

export const getTodos = async function (date) {
  const [todayGoals, taskPool, longTermGoals] = (
    await Promise.all([
      todoService.getTodos(
        "date",
        window.IDBKeyRange.only(date),
        (v) => v.source == 0
      ),
      todoService.getTodos("source", window.IDBKeyRange.only(1)),
      todoService.getTodos("source", window.IDBKeyRange.only(2)),
    ])
  ).map((data) => data.sort((a, b) => a.sort - b.sort));

  return [
    { title: "今日目标", source: 0, data: todayGoals },
    { title: "任务池", source: 1, data: taskPool },
    { title: "长期目标", source: 2, data: longTermGoals },
  ];
};

export const getAllTodos = async function () {
  return await todoService.getAllTodos(...arguments);
};

export const addTodo = async function () {
  return await todoService.addTodo(...arguments);
};

export const updateTodo = async function () {
  return await todoService.updateTodo(...arguments);
};

export const deleteTodo = async function () {
  return await todoService.deleteTodo(...arguments);
};

export const clearTodos = async function () {
  return await todoService.clearTodos(...arguments);
};

export const batchAddOrUpdateTodos = async function (list) {
  const addData = list.filter((v) => !v.id);
  const updateData = list.filter((v) => v.id);
  addData.forEach(async (d) => {
    await todoService.addTodo(d);
  });
  updateData.forEach(async (d) => {
    await todoService.updateTodo(d);
  });
};
