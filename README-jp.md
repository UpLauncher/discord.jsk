# discord.jsk, discord.js jishaku (jishaku for discord.js)

English README: [here](README.md)

このプロジェクトは、discord.py の jishaku を discord.js で使用できるようにするプロジェクトです。

オリジナルの jishaku(discord.py)はこちら: https://github.com/Gorialis/jishaku

## インストール

1. npm、pnpm、yarn を使用してインストール

```sh
# npm
npm install @uplc/discord.jsk

# pnpm
pnpm install @uplc/discord.jsk

# yarn
yarn add @uplc/discord.jsk
```

2. discord.jsk を discord.js に追加する

ここでは、サンプルボットを作成しています。**Discord.jsk の使用には Message Content Intent が必要です。Discord Developer Portal で Message Content Intent を有効にしてから discord.jsk を使用してください。**

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
    encoding: "UTF-8" /* 日本語環境ではShift-JISを推奨 */,
    useableUserId: ["0", "1"] /* Users who can use the bot */,
  });

  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => jsk.onMessageCreated(message));

client.login(token)
```

## 使用方法

各コマンドの使用方法を説明します。

### .jsk sh <コマンド>

このコマンドは、シェルコマンドを使用するコマンドです。この機能は現在、**Windows でのみ動作します。**

<コマンド>には、実行するコマンドを記入してください。

### .jsk js <コード>

このコマンドは、JavaScript のコードを実行するコマンドです。

<コード>には、実行するコードを記入してください。

## クレジット

| 名前       | 説明                             |
| ---------- | -------------------------------- |
| discord.js | discord.jskのベースの部分                     |
| jishaku    | このプロジェクトの元             |
| TypeScript | discord.jsk の政策に使用した言語 |
