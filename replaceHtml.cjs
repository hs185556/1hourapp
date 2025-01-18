const fs = require("fs");
const path = require("path");

// 读取文件内容
const filePath = path.join(__dirname, "./dist/index.html");
try {
  let data = fs.readFileSync(filePath, "utf8");

  // console.log(data);
  data = data
    .replaceAll(` type="module"`, "")
    .replaceAll(" nomodule", "")
    .replaceAll(" crossorigin", "");

  data.match(/<script[^>]*>([\s\S]*?)<\/script>/g).forEach((item) => {
    if (
      item.includes("import.meta.url") ||
      item.includes("!function()")
    )
      data = data.replace(item, "");
  });

  // 写入修改后的内容
  fs.writeFileSync(filePath, data, "utf8");
} catch (err) {
  console.error("Error reading or processing the file:", err);
}
