// src/commands/help.js
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show help for the AI bot."),

  async execute(interaction) {
    const content = [
      "**AI Bot Help**",
      "",
      "Commands:",
      "• `/ask question:<text>` – Ask the AI a question. The bot remembers past context in this channel with you.",
      "• `/history show` – See how many messages are stored in your history.",
      "• `/history clear` – Clear your history for this channel.",
      "• `/help` – Show this help message.",
      "",
      "The bot uses a (potentially) free or local LLM via an OpenAI-compatible API. " +
        "You can configure the endpoint and model in the `.env` file.",
    ].join("\n");

    await interaction.reply(content);
  },
};
