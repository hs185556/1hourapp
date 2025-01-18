class IndexDB {
  constructor(dbName, version, onupgradeneeded) {
    this.dbName = dbName;
    this.version = version;
    // 正如前面提到的，onupgradeneeded 是我们唯一可以修改数据库结构的地方。在这里面，我们可以创建和删除对象存储以及创建和删除索引。
    this.onupgradeneeded = onupgradeneeded;
    this.db = null;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.onupgradeneeded(this.db);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async getObjectStore(storeName, mode = "readonly") {
    if (!this.db) {
      throw new Error("Database is not open");
    }

    return this.db.transaction(storeName, mode).objectStore(storeName);
  }

  async getAll(storeName) {
    const objectStore = await this.getObjectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async getCursorResult(objectStoreOrIndex, idbKeyRange, filterFn) {
    return new Promise((resolve, reject) => {
      const result = [];
      const request = objectStoreOrIndex.openCursor(idbKeyRange);

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (!filterFn || filterFn(cursor.value)) result.push(cursor.value);
          cursor.continue();
        } else {
          console.log("没有更多记录了！", result);
          resolve(result);
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async add(storeName, data) {
    const objectStore = await this.getObjectStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = objectStore.add(data);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async put(storeName, data) {
    const objectStore = await this.getObjectStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = objectStore.put(data);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async delete(storeName, key) {
    const objectStore = await this.getObjectStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(key);

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  async clear(storeName) {
    const objectStore = await this.getObjectStore(storeName, "readwrite");
    return new Promise((resolve, reject) => {
      const request = objectStore.clear();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
}

export default IndexDB;
