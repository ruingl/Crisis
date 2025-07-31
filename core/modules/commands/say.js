module.exports = {
  config: {
    name: "say",
    description: "Repeats messages sent from bot.",
    author: "Rui Reogo",
    hasPrefix: true,
    needAdmin: false
  },
  run: async ({ api, event, args }) => {
    const userMsg = args.join(" ");
    if (!userMsg) {
      return api.sendMessage("⚠️ You didn’t provide any message for me to say.", event.threadID, event.messageID);
    }

    const name = event.senderName || "User";
    const mentionTag = `@${name}`;
    const messageBody = `${mentionTag}, you said: ${userMsg}`;

    const mentions = [{
      tag: mentionTag,
      id: event.senderID
    }];

    api.sendMessage({ body: messageBody, mentions }, event.threadID, event.messageID);
  }
};
