// src/commands/history.js
const { SlashCommandBuilder } = require("discord.js");
const { getHistorySummary, clearHistory } = require("../memory");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("history")
    .setDescription("Show or clear your stored conversation history.")
    .addSubcommand((sub) =>
      sub.setName("show").setDescription("Show how much history is stored.")
    )
    .addSubcommand((sub) =>
      sub.setName("clear").setDescription("Clear your conversation history.")
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channelId = interaction.channelId;
    const userId = interaction.user.id;

    if (subcommand === "show") {
      const summary = getHistorySummary(channelId, userId);
      await interaction.reply(
        `You have **${summary.count}** messages stored in memory for this channel.`
      );
    } else if (subcommand === "clear") {
      clearHistory(channelId, userId);
      await interaction.reply(
        "Your conversation history for this channel has been cleared."
      );
    } else {
      await interaction.reply("Unknown subcommand.");
    }
  },
};
