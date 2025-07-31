const { spawn } = require("child_process");

function start() {
  console.clear();

  const child = spawn("node main/index.js", {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });

  child.on("exit", (code) => {
    if (code === 2) {
      start();
    };
  });
};

start();
