const log = console.log;

class WebSql {
  constructor() {
    this.db = null;
    this.transaction = null;
  }

  async executeSql(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            params,
            (tx, result) => resolve(result),
            (tx, err) => reject(err)
          );
        },
        (err) => reject(err)
      );
    });
  }

  async openDatabase(name, version, description, size) {
    this.db = window.openDatabase(name, version, description, size);
    log(this.db ? "数据库创建/打开成功!" : "数据库创建/打开失败！");
    return this.db;
  }

  async createTable(tableName, columns) {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
    await this.executeSql(sql);
    log(`表创建成功 ${tableName}`);
  }

  async closeDatabase() {
    if (this.db) {
      this.db.close();
      log("数据库已关闭");
    } else {
      log("数据库未打开");
    }
  }

  async dropTable(tableName) {
    const sql = `DROP TABLE IF EXISTS ${tableName}`;
    await this.executeSql(sql);
    log(`表删除成功 ${tableName}`);
  }

  async insertData(tableName, data) {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const params = Object.values(data);
    await this.executeSql(sql, params);
    log("数据插入成功");
  }

  async queryData(tableName, columns = "*", where = "") {
    const sql = `SELECT ${columns} FROM ${tableName} ${
      where ? `WHERE ${where}` : ""
    }`;
    const result = await this.executeSql(sql);
    const rows = result.rows;
    const items = [];
    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      items.push(item);
    }
    return items;
  }

  async beginTransaction() {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          this.transaction = tx;
          log("事务开始");
          resolve(tx);
        },
        (err) => {
          log("事务开始失败", err.message);
          reject(err);
        }
      );
    });
  }

  async commitTransaction() {
    if (!this.transaction) {
      throw new Error("没有开启的事务");
    }
    await this.executeSql("COMMIT");
    this.transaction = null;
    log("事务提交成功");
  }

  async rollbackTransaction() {
    if (!this.transaction) {
      throw new Error("没有开启的事务");
    }
    await this.executeSql("ROLLBACK");
    this.transaction = null;
    log("事务回滚成功");
  }

  async batchInsert(tableName, data) {
    const tx = await this.beginTransaction();
    try {
      for (const item of data) {
        const columns = Object.keys(item).join(", ");
        const placeholders = Object.keys(item)
          .map(() => "?")
          .join(", ");
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        const params = Object.values(item);
        await this.executeSql(sql, params);
      }
      await this.commitTransaction();
      log("批量插入成功");
    } catch (err) {
      await this.rollbackTransaction();
      log("批量插入失败", err.message);
      throw err;
    }
  }

  async batchUpdate(tableName, data) {
    const tx = await this.beginTransaction();
    try {
      for (const item of data) {
        const keys = Object.keys(item).join(",");
        const values = Object.values(item)
          .map((value) => (typeof value === "string" ? `'${value}'` : value))
          .join(",");
        const sql = `UPDATE ${tableName} SET ${keys} = (${values}) WHERE id = ?`;
        await this.executeSql(sql, [item.id]);
      }
      await this.commitTransaction();
      log("批量更新成功");
    } catch (err) {
      await this.rollbackTransaction();
      log("批量更新失败", err.message);
      throw err;
    }
  }
}

export default WebSql;
