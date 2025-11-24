# AI Discord Bot (Local LLM)

A lightweight Discord bot that integrates with local Large Language Models (like LLaMA, Mistral, or generic OpenAI-compatible APIs). It features persistent conversation memory, allowing the AI to remember context from previous messages within a channel.

## 🌟 Features

- [cite_start]**/ask**: query the AI with context-aware questions.
- **Memory System**: Stores conversation history locally in a JSON file, enabling the bot to remember past interactions.
- **/history**: Commands to view or clear your conversation history with the bot.
- **Local LLM Support**: Configurable to work with local endpoints (e.g., LM Studio, Ollama) or remote OpenAI-compatible APIs.

## 📋 Prerequisites

- **Node.js** (v16.9.0 or higher).
- A **Discord Bot Token** and **Client ID** from the [Discord Developer Portal](https://discord.com/developers/applications).
- A running LLM server (e.g., LM Studio running on `http://localhost:1234`).

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ai-discord-bot

2. **install dependencies**
   ```bash
   npm install

3. **Configure Environment Variables: Create a file named .env in the root directory and add the following keys:**
   ```bash
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=your_server_id_here

   # LLM Endpoint (Default: LM Studio / Localhost)
   LLM_API_URL=http://localhost:1234/v1/chat/completions
   LLM_MODEL=local-model

4. **Deploy Slash Commands: You must register the slash commands with Discord before using the bot:**
   ```bash
   npm run deploy-commands

5. **Start the bot**
   ```bash
   npm start

## Usage
Once online, use the following slash commands:
```bash
Command,Description
/ask <question>,Send a message to the AI. It will remember previous context.
/history show,Check how many messages are stored in your current history.
/history clear,Wipe the memory for the current channel/user.
/help,Show the help menu.
