import Discord, { Intents } from "discord.js";
import mongoose from "mongoose";
require("dotenv").config();

import { COMMAND_PREFIX, GUILD_ID } from "./constants";
import addPointsOnMessage from "./handlers/addPointsOnMessage";
import sendDailyUpdate from "./handlers/sendDailyUpdate";
import { commandHandler } from "./handlers/_index";

const client = new Discord.Client({
   intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
   ],
});

// Connect to mongoose
mongoose.connect(
   `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
);

client.on("messageCreate", (message) => {
   if (message.guildId !== GUILD_ID || message.author.bot) return;

   if (message.content.startsWith(COMMAND_PREFIX)) {
      commandHandler(message);
   } else {
      addPointsOnMessage(message);
   }
});

client.on("ready", () => {
   console.log("Ready");

   setInterval(() => sendDailyUpdate(client), 1000 * 10);
});

client.login(process.env.DISCORD_TOKEN);
