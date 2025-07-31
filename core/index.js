const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

const htmlPath = path.join(__dirname, "core", "index.html");
if (fs.existsSync(htmlPath)) {
  app.get("/", (req, res) => {
    res.sendFile(htmlPath);
  });
} else {
  app.get("/", (req, res) => {
    res.send("CrisisBot is online");
  });
}

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

function startBot() {
  console.clear();
  const child = spawn("node main/index.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code) => {
    if (code === 2) {
      startBot();
    }
  });
}

startBot();
