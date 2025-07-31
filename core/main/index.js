const { login } = require("ws3-fca");
const utils = require("../utils");
const figlet = require("figlet");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const ctx = {
  get config() {
    return JSON.parse(fs.readFileSync(path.join(
      __dirname, "../json/config.json"
    ), "utf8"));
  },
  get cookie() {
    return JSON.parse(fs.readFileSync(path.join(
      __dirname, "../json/cookie.json"
    ), "utf8"));
  },

  commands: new Map(),
};

async function setup() {
  const banner = figlet.textSync("Crisis");
  console.log(chalk.red(banner));
  console.log();

  utils.info("Name: CrisisBot");
  utils.info("Time:", new Date().toLocaleTimeString());
  utils.info("Made by Rui Reogo, Have fun!");
  console.log();

  utils.info("Loading commands...");
  console.log();
  const cErrors = await utils.loadCommands(ctx);
  
  if (Object.keys(cErrors).length > 0) {
    utils.warn("Found errors!");
    for (const [key, val] of Object.entries(cErrors)) {
      utils.error(`[${key}] - ${val}`);
    };
    console.log();
  };

  utils.info("Loaded commands!");
  utils.info("Logging in...");
  main();
};

function main() {
  const credentials = {};
  if (ctx.config.credentials.useCookie) {
    credentials.appState = ctx.cookie;
  } else {
    credentials.email = ctx.config.credentials.email;
    credentials.password = ctx.config.credentials.password;
  };

  login(credentials, ctx.config.fcaOptions, (err, api) => {
    if (err) return utils.error(err);
    
    utils.info("Logged in!");

    api.listenMqtt(async (err, event) => {
      if (err) return utils.error(err);

      if (utils.type !== "message") return;
      if (!utils.body) return;

      let { botPrefix, botAdmins } = ctx.config;
      let [command, ...args] = event.body?.trim().split(/\s+/);
      if (command.startsWith(botPrefix)) {
        command = command.slice(botPrefix.length);
      };

      const cmdFile = ctx.commands.get(command);
      if (cmdFile) {
        try {
          if (cmdFile.config.needAdmin) {
            if (!botAdmins.includes(event.senderID)) {
              return api.sendMessage(
                "You are not allowed to use this command.",
                event.threadID,
                event.messageID
              );
            };
          };

          const hasPrefix = cmdFile.config.hasPrefix !== false;

          if (
            hasPrefix &&
            !event.body.toLowerCase().startsWith(botPrefix)
          ) {
            return api.sendMessage(
              `The command: ${command} needs prefix.`,
              event.threadID,
              event.messageID
            );
          };

          await cmdFile.run({
            api,
            event,
            args,
            ctx,
          });
        } catch (error) {
          api.sendMessage(
            "An error occured on running this command. Check logs to see further information on why the command crashed.",
            event.threadID,
            event.messageID
          );
        };
      } else if (event.body?.startsWith(botPrefix)) {
        api.sendMessage(
          `The command ${command ? `"${command}"` : "that you are using"} doesn't exist.`,
          event.threadID,
          event.messageID
        );
      };
    });
  });
};

(async () => {
  await setup();
})();
