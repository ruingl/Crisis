const path = require("path");
const fs = require("fs");

module.exports.loadCommands = (ctx) => {
  return new Promise((resolve) => {
    const errors = {};
    const cPath = path
      .join(__dirname, "../modules/commands");
    const cFiles = fs
      .readdirSync(cPath)
      .filter((f) => f.endsWith(".js"));

    for (const file of cFiles) {
      try {
        const cmd = require(path.join(cPath, file));

        // check config structure if correct
        if (
          typeof cmd.config.name !== "string" ||
          typeof cmd.config.author !== "string" ||
          typeof cmd.config.description !== "string" ||
          typeof cmd.config.hasPrefix !== "boolean" ||
          typeof cmd.config.needAdmin !== "boolean" ||
          typeof cmd.run !== "function"
        ) {
          errors[file] = "Invalid command structure.";
          continue;
        };

        // check if name already used
        if (ctx.commands.has(cmd.config.name)) {
          errors[file] = `Name: ${cmd.config.name} already used.`;
          continue;
        };

        ctx.commands.set(cmd.config.name, cmd);
      } catch (error) {
        errors[file] = `An error occured. ${error.message}`;
      };
    };

    resolve(errors);
  });
};
