# discord.jsk, discord.js jishaku (jishaku for discord.js)

Japanese README: [here](README-jp.md)

This project is to make jishaku from discord.py available for discord.js.

The original jishaku (discord.py) is here: https://github.com/Gorialis/jishaku

## Installation

1. install using npm, pnpm, or yarn
```sh
# npm
npm install @uplc/discord.jsk

# pnpm
pnpm install @uplc/discord.jsk

# yarn
yarn add @uplc/discord.jsk
```

2. add discord.jsk to discord.js

Here, a sample bot is created. **Discord.jsk requires Message Content Intent, please enable Message Content Intent on Discord Developer Portal before using discord.jsk.**

```js
// https://discordjs.guide/creating-your-bot/main-file.html
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

// Require the necessary discord.jsk class
const djsk = require("@uplc/discord.jsk");

// Create a new client instance
// Important! Message Content Intent must be enabled to use djsk.
const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    /* Required for guild use */
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// discord.jsk object
let jsk = {};

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  // init discord.jsk
  jsk = new djsk(client, {
    encoding: "UTF-8" /* Shift-JIS is recommended for Japanese environment */,
    useableUserId: ["0", "1"] /* Users who can use the bot */,
  });

  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => jsk.onMessageCreated(message));

client.login(token)
```

## Usage

This section describes how to use each command.

### .jsk sh \<command\>

This command is a command to use shell commands. This feature currently only works on **Windows. **

<command> is the command to execute.

### .jsk js \<code\>

This command executes JavaScript code.

Please fill in the \<code\> with the code you want to run.

## Credits

| Name | Description |
| ---------- | -------------------------------- |
| discord.js | the base part of discord.jsk |
| jishaku | source of this project |
| TypeScript | Language used for discord.jsk |