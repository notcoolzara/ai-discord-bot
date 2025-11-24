// src/memory.js
const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "..", "memory.json");

// { [key: string]: { messages: Array<{role, content}> } }
// key = `${channelId}:${userId}`
let memoryStore = {};

// Load memory from disk
function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const raw = fs.readFileSync(MEMORY_FILE, "utf-8");
      memoryStore = JSON.parse(raw);
      console.log("[Memory] Loaded memory from disk.");
    } else {
      console.log("[Memory] No existing memory file. Starting fresh.");
    }
  } catch (err) {
    console.error("[Memory] Failed to load memory:", err);
    memoryStore = {};
  }
}

// Save memory to disk
function saveMemory() {
  try {
    fs.writeFileSync(
      MEMORY_FILE,
      JSON.stringify(memoryStore, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("[Memory] Failed to save memory:", err);
  }
}

function makeKey(channelId, userId) {
  return `${channelId}:${userId}`;
}

// Append message to memory history
function addMessage(channelId, userId, role, content, options = {}) {
  const maxMessages = options.maxMessages || 30; // total role+assistant messages
  const key = makeKey(channelId, userId);

  if (!memoryStore[key]) {
    memoryStore[key] = { messages: [] };
  }

  memoryStore[key].messages.push({ role, content });

  // Trim old messages to keep memory bounded
  while (memoryStore[key].messages.length > maxMessages) {
    memoryStore[key].messages.shift();
  }

  saveMemory();
}

// Get history for this channel+user
function getHistory(channelId, userId) {
  const key = makeKey(channelId, userId);
  if (!memoryStore[key]) return [];
  return memoryStore[key].messages;
}

// Clear history for this channel+user
function clearHistory(channelId, userId) {
  const key = makeKey(channelId, userId);
  delete memoryStore[key];
  saveMemory();
}

// Simple debug: get message count
function getHistorySummary(channelId, userId) {
  const history = getHistory(channelId, userId);
  return {
    count: history.length,
  };
}

module.exports = {
  loadMemory,
  saveMemory,
  addMessage,
  getHistory,
  clearHistory,
  getHistorySummary,
};
