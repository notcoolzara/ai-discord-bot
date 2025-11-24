// src/commands/ask.js
const { SlashCommandBuilder } = require("discord.js");
const { callLLM } = require("../llm");
const { addMessage, getHistory } = require("../memory");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the AI a question (with long-term memory).")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Your question or message")
        .setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question", true);
    const channelId = interaction.channelId;
    const userId = interaction.user.id;

    await interaction.deferReply(); // show "thinking..."

    try {
      const history = getHistory(channelId, userId);

      const systemPrompt =
        "You are a helpful, precise assistant in a Discord server. " +
        "You remember context from earlier messages in this channel with this user. " +
        "Be concise, accurate, and avoid hallucinations.";

      // Add user question to memory (role: user)
      addMessage(channelId, userId, "user", question);

      const answer = await callLLM({
        systemPrompt,
        history,
        userMessage: question,
      });

      // Save assistant answer
      addMessage(channelId, userId, "assistant", answer);

      await interaction.editReply(answer);
    } catch (err) {
      console.error("[/ask] Error:", err);
      await interaction.editReply(
        "There was an error talking to the AI model."
      );
    }
  },
};
