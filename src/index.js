// src/index.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { loadMemory } = require("./memory");

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("DISCORD_TOKEN missing in .env");
  process.exit(1);
}

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    console.log(`[Bot] Loaded command: ${command.data.name}`);
  } else {
    console.warn(
      `[Bot] Command at ${filePath} is missing "data" or "execute" property.`
    );
  }
}

// Load memory from disk before login
loadMemory();

client.once(Events.ClientReady, (c) => {
  console.log(`[Bot] Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`[Bot] No command matching ${interaction.commandName}.`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(
      `[Bot] Error executing command ${interaction.commandName}:`,
      error
    );

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(
        "There was an error while executing this command."
      );
    } else {
      await interaction.reply({
        content: "There was an error while executing this command.",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
