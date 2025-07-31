const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "core")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "core", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

const { spawn } = require("child_process");

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
