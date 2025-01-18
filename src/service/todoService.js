import IndexDB from "@/utils/indexDB";

const DB_NAME = "todoDB";
const DB_VERSION = 1;
const STORE_NAME = "todos";

class TodoService {
  constructor() {
    this.indexDB = new IndexDB(DB_NAME, DB_VERSION, this.onupgradeneeded);
  }

  async onupgradeneeded(db) {
    if (!db) {
      console.error("Database is not open");
      return;
    }

    return new Promise((res) => {
      const objectStore = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("date", "date", { unique: false });
      objectStore.createIndex("source", "source", { unique: false });
      // 使用事务的 oncomplete 事件确保在插入数据前对象存储已经创建完毕。
      objectStore.transaction.oncomplete = (event) => {
        res(objectStore);
      };
    });
  }

  async openTodo() {
    try {
      return this.indexDB.db || (await this.indexDB.open());
    } catch (error) {
      console.error("Failed to open todo database:", error);
    }
  }

  async getAllTodos() {
    try {
      return await this.indexDB.getAll(STORE_NAME);
    } catch (error) {
      console.error("Failed to get todos:", error);
    }
  }

  async getTodos(filterIndex, idbKeyRange, filterFn) {
    try {
      const objectStore = await this.indexDB.getObjectStore(STORE_NAME);
      const index = objectStore.index(filterIndex);
      return await this.indexDB.getCursorResult(index, idbKeyRange, filterFn);
    } catch (error) {
      console.error("Failed to get todos:", error);
    }
  }

  async addTodo(todo) {
    try {
      return await this.indexDB.add(STORE_NAME, todo);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  async updateTodo(updatedTodo) {
    try {
      return await this.indexDB.put(STORE_NAME, updatedTodo);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  }

  async deleteTodo(id) {
    try {
      await this.indexDB.delete(STORE_NAME, id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }

  async clearTodos() {
    try {
      await this.indexDB.clear(STORE_NAME);
    } catch (error) {
      console.error("Failed to clear todos:", error);
    }
  }
}

export default new TodoService();
