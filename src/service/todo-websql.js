import WebSql from "../utils/websql";

class TodoService {
  constructor() {
    this.db = new WebSql();
  }

  async initDatabase() {
    await this.db.openDatabase(
      "todoDB",
      "1.0",
      "Todo List Database",
      2 * 1024 * 1024
    );
    await this.db.createTable(
      "todos",
      "id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, isDone BOOLEAN, date TEXT, source INTEGER, sort INTEGER"
    );
  }

  async closeDatabase() {
    await this.db.closeDatabase();
  }

  async addTodo(todo) {
    await this.db.insertData("todos", todo);
  }

  async getTodos({ date, source }) {
    let sql = `SELECT * FROM todos`;
    const params = [];

    if (date !== undefined) {
      sql += ` WHERE date = ?`;
      params.push(date);
    }

    if (source !== undefined) {
      if (params.length > 0) {
        sql += ` AND source = ?`;
      } else {
        sql += ` WHERE source = ?`;
      }
      params.push(source);
    }

    sql += ` GROUP BY source ORDER BY sort ASC`;

    return await this.db.executeSql(sql, params);
  }

  async getListData(date) {
    const data1 = await this.getTodos(date, 0);
    const data2 = await this.getTodos(1);
    const data3 = await this.getTodos(2);
    return {
      0: data1,
      1: data2,
      2: data3,
    };
  }

  async getTodoById(id) {
    return await this.db.queryData("todos", "*", `id = ${id}`);
  }

  async updateTodo(id, todo) {
    const sql = `UPDATE todos SET content = ?, isDone = ?, date = ?, source = ?, sort = ? WHERE id = ?`;
    const params = [
      todo.content,
      todo.isDone,
      todo.date,
      todo.source,
      todo.sort,
      id,
    ];
    await this.db.executeSql(sql, params);
  }

  async deleteTodo(id) {
    const sql = `DELETE FROM todos WHERE id = ?`;
    await this.db.executeSql(sql, [id]);
  }
}

export default TodoService;
