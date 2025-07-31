module.exports = {
  config: {
    name: "hello",
    description: "Testing command.",
    author: "Rui Reogo",
    hasPrefix: true,
    needAdmin: false,
  },
  run: async ({ api, event, args }) => {
    api.sendMessage("Hello!", event.threadID, event.messageID);
  },
};
