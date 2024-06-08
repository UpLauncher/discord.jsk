/*
    jjshaku for Node.js (Discord.jsk, Discord.js jishaku) (djsk)

    * Currently supported Windows only.

    Created by UpLauncher Team.
*/
import * as child_process from "child_process";
import { tmpdir } from "os";
import { Client, Message } from "discord.js";
import { readFileSync, writeFile, writeFileSync } from "fs";

const encoding = require("encoding-japanese");

let isShRunning = false;

class Logger {
  funcName = "default";
  constructor(funcName = "default") {
    this.funcName = funcName;
  }
  info(...message: string[]) {
    console.info([`discord.jsk: ${this.funcName} (INFO)`], ...message);
  }
  error(...message: string[]) {
    console.error([`discord.jsk: ${this.funcName} (ERROR)`], ...message);
  }
}

interface djskConfig {
  encoding: string;
  useableUserId: Array<string>;
  allowMultiShRunning?: boolean;
}

export class djsk {
  client: Client;
  message: Message | undefined;
  djskInitConfig: djskConfig;
  constructor(client: Client, djskInitConfig: djskConfig) {
    this.client = client;
    this.djskInitConfig = djskInitConfig;

    const logger = new Logger("init");
    logger.info(
      "=====discord.jsk=====\n",
      "Initialization of discord.jsk is complete!\n",
      "=====discord.jsk====="
    );
  }
  async onMessageCreated(message: Message) {
    this.message = message;
    let isMessageSended = false;
    let count = 0;
    let currentContent = new String();
    let createdMessage = {} as Message;

    if (!this.djskInitConfig.useableUserId.includes(message.author.id)) return;
    if (!message.content.startsWith(".jsk")) return;

    if (message.content.startsWith(".jsk sh ")) {
      if (isShRunning && !this.djskInitConfig.allowMultiShRunning) {
        message.reply(
          "You are trying to run multiple sh processes, but cannot because the allowMultiShRunning option is disabled.\nAlso, use of the allowMultiShRunning option is deprecated."
        );
      }
      const toString = (bytes: Buffer) => {
        return encoding.convert(bytes, {
          from: "SJIS",
          to: "UNICODE",
          type: "string",
        });
      };

      const command = message.content.replace(".jsk sh ", "");
      const spawnProcess = child_process.spawn("cmd", ["/c", command], {
        //@ts-ignore
        encoding: "Shift_JIS",
      }) as child_process.ChildProcessWithoutNullStreams;
      isShRunning = true;
      spawnProcess.stdout.on("data", (data) => {
        currentContent +=
          this.djskInitConfig.encoding.toLowerCase() == "shift_jis"
            ? toString(data)
            : String(data);
      });

      const logger = new Logger("shell");
      const timeout = setInterval(async () => {
        try {
          if (isMessageSended) {
            // writeFileSync(
            //   "src/config/latest-jsk-log.json",
            //   toString(currentContent)
            // );
            // const file = readFileSync("src/config/latest-jsk-log.json");
            if (createdMessage) {
              await createdMessage.edit(
                `\n\`\`\`Command: ${command} \n\n${
                  currentContent.length > 1900
                    ? currentContent.slice(currentContent.length - 1900)
                    : currentContent
                }\`\`\``
              );
            } else {
              createdMessage = await message.reply(
                `\n\`\`\`Command: ${command} \n\n${
                  currentContent.length > 1900
                    ? currentContent.slice(currentContent.length - 1900)
                    : currentContent
                }\`\`\``
              );
            }
          } else {
            isMessageSended = true;
            // writeFileSync(
            //   "src/config/latest-jsk-log.json",
            //   toString(currentContent)
            // );
            // const file = readFileSync("src/config/latest-jsk-log.json");
            createdMessage = await message.reply(
              `\n\`\`\`Command: ${command} \n\n${
                currentContent.length > 1900
                  ? currentContent.slice(currentContent.length - 1900)
                  : currentContent
              }\`\`\``
            );
          }
        } catch (error: any) {
          logger.error("An error has occurred.", error);
        }
      }, 2000);
      spawnProcess.on("close", async () => {
        isShRunning = false;
        try {
          if (isMessageSended) {
            // writeFileSync(
            //   "src/config/latest-jsk-log.json",
            //   toString(currentContent)
            // );
            // const file = readFileSync("src/config/latest-jsk-log.json");
            try {
              if (createdMessage) {
                await createdMessage.edit(
                  `\n\`\`\`Command: ${command} \n\n${
                    currentContent.length > 1900
                      ? currentContent.slice(currentContent.length - 1900)
                      : currentContent
                  }\`\`\``
                );
              } else {
                console.log(
                  currentContent.slice(currentContent.length - 1900).length,
                  currentContent.length
                );
                createdMessage = await message.reply(
                  `\n\`\`\`Command: ${command} \n\n${
                    currentContent.length > 1900
                      ? currentContent.slice(currentContent.length - 1900)
                      : currentContent
                  }\`\`\``
                );
              }
            } catch (error: any) {
              logger.error("An error has occurred.", error);
            }
          } else {
            isMessageSended = true;
            // writeFileSync(
            //   "src/config/latest-jsk-log.json",
            //   toString(currentContent)
            // );
            // const file = readFileSync("src/config/latest-jsk-log.json");
            // createdMessage = await message.reply(
            //   /* { files: [{ name: "file.json", attachment: file }] } */ "a```\n" +
            //     command +
            //     "\n" +
            //     (toString(currentContent).length > 1900)
            //     ? toString(currentContent).slice(1900)
            //     : toString(currentContent) + "\n```"
            // );
            createdMessage = await message.reply(
              `\n\`\`\`Command: ${command} \n\n${
                currentContent.length > 1900
                  ? currentContent.slice(currentContent.length - 1900)
                  : currentContent
              }\`\`\``
            );
          }
        } catch (error: any) {
          logger.error("An error has occurred.", error);
        }

        const tempLogMsgId = createdMessage.id;

        createdMessage.react("✅");

        this.client.on("messageReactionAdd", async (react, user) => {
          if (
            react.emoji.name == "✅" &&
            react.message.id == tempLogMsgId &&
            this.djskInitConfig.useableUserId.includes(user.id)
          ) {
            const tmpdirName = tmpdir() + "djsk-log-" + new Date().getMilliseconds;
            writeFileSync(
              tmpdirName,
              currentContent.toString()
            );
            const file = readFileSync(tmpdirName);
            await message.reply({
              files: [{ name: "file.json", attachment: file }],
            });
          }
        });

        clearInterval(timeout);
        isMessageSended = false;
        //@ts-ignore
        createdMessage = {};
      });
    } else if (message.content.startsWith(".jsk js ")) {
      const logger = new Logger("javascript");
      const command = message.content.replace(".jsk js ", "");
      try {
        message.reply("```\n" + eval(command) + "\n```").catch((error) => {
          message.reply("```\n" + error + "\n```");
        });
      } catch (error: any) {
        logger.error("An error has occurred.", error);

        message.reply("```\n" + error + "\n```");
      }
    } else if (message.content.startsWith(".jsk shutdown")) {
      const logger = new Logger("shutdown");
      await message.reply("Goodbye👋");
      this.client.destroy();
      process.exit(0);
    }
  }
}
