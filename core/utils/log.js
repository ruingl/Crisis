const chalk = require("chalk");

module.exports.log = (...args) => {
  console.log(chalk.gray("[LOG]", ...args));
};

module.exports.info = (...args) => {
  console.info(chalk.blue("[INFO]", ...args));
};

module.exports.warn = (...args) => {
  console.warn(chalk.yellow("[WARN]", ...args));
};

module.exports.error = (...args) => {
  console.error(chalk.red("[ERROR]", ...args));
};
