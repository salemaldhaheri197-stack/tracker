// app.js
// Connects directly to a PUBLIC ElevenLabs Conversational AI agent.
// No backend, no API key in this file at all - safe to run purely on GitHub Pages.
// Requires: agent's Security setting set to "Public" in the ElevenLabs dashboard.

import { Conversation } from "https://esm.sh/@elevenlabs/client";

const talkBtn = document.getElementById("talkBtn");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");

// Your agent's public ID (safe to expose - it's not a secret, just an identifier)
const AGENT_ID = "AbCdEf123456xyz"; // <-- replace with your real agent ID from the ElevenLabs dashboard

let conversation = null;
let isActive = false;

function addLine(role, text) {
  const div = document.createElement("div");
  div.className = `line ${role}`;
  div.textContent = `${role === "user" ? "You" : "Agent"}: ${text}`;
  transcriptEl.appendChild(div);
  transcriptEl.scrollTop = transcriptEl.scrollHeight;
}

async function startConversation() {
  try {
    statusEl.textContent = "Requesting mic access...";

    conversation = await Conversation.startSession({
      agentId: AGENT_ID,
      onConnect: () => {
        statusEl.textContent = "Listening... ask about a movie or episode";
        talkBtn.textContent = "🛑 Stop";
        talkBtn.classList.add("active");
        isActive = true;
      },
      onDisconnect: () => {
        statusEl.textContent = "Idle";
        talkBtn.textContent = "🎙️ Start Talking";
        talkBtn.classList.remove("active");
        isActive = false;
      },
      onMessage: (msg) => {
        if (msg?.message) {
          addLine(msg.source === "user" ? "user" : "agent", msg.message);
        }
      },
      onError: (err) => {
        console.error("Conversation error:", err);
        statusEl.textContent = "Error — check console";
      },
    });
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to start: " + err.message;
  }
}

async function stopConversation() {
  if (conversation) {
    await conversation.endSession();
    conversation = null;
  }
}

talkBtn.addEventListener("click", () => {
  if (isActive) {
    stopConversation();
  } else {
    startConversation();
  }
});
