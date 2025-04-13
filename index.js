import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply(`
  Welcome to ALGO BOT.
  You can ask leetcode question here.
  Just give the question name Eg. 3sum
  `))
bot.command("whomadethis", (ctx) => ctx.reply("Shubham"));
bot.command("hi", (ctx) => ctx.reply("You can ask leetcode questions here."));

async function handleFile(ctx, fileName) {
  try {
    const filePath = path.join(__dirname, "solutions", `${fileName}.txt`);
    const fileContent = await fs.readFile(filePath, "utf8");
    ctx.reply(fileContent);
  } catch (error) {
    console.error("Error reading file:", error);
    ctx.reply("Sorry, I couldn't read the file. Please make sure the file exists and try again.");
  }
}

bot.on("text", async (ctx) => {
  const fileName = ctx.message.text.trim();
  if (!fileName) {
    ctx.reply("Please provide a valid file name.");
    return;
  }
  await handleFile(ctx, fileName);
});

bot.on("sticker", (ctx) => ctx.reply("❤️"));

bot.launch();
