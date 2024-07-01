const path = require("path");
const fs = require("fs");
const util = require("util");
const { Telegraf } = require("telegraf");
const express = require("express");

require("dotenv").config();

const readFile = util.promisify(fs.readFile);

const bot = new Telegraf(process.env.SECRET_KEY);

bot.start((ctx) => ctx.reply("Welcome to Algo Bot by Shubham"));
bot.command("whomadethis", (ctx) => ctx.reply("Shubham"));
bot.command("hi", (ctx) => ctx.reply("You can ask leetcode questions here."));

async function handleFile(ctx, fileName) {
  try {
    const filePath = path.join(__dirname, "solutions", `${fileName}.txt`);
    const fileContent = await readFile(filePath, "utf8");
    ctx.reply(fileContent);
  } catch (error) {
    console.error("Error reading file:", error);
    ctx.reply(
      "Sorry, I couldn't read the file. Please make sure the file exists and try again."
    );
  }
}

bot.on("text", async (ctx) => {
  try {
    const fileName = ctx.message.text.trim();
    if (!fileName) {
      ctx.reply("Please provide a valid file name.");
      return;
    }
    await handleFile(ctx, fileName);
  } catch (error) {
    console.error("Error:", error);
    ctx.reply("An error occurred. Please try again later.");
  }
});

bot.on("sticker", (ctx) => ctx.reply("❤️"));

const app = express();

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "http://localhost/3000";

bot.telegram.setWebhook(`${URL}/bot${process.env.SECRET_KEY}`);

app.use(bot.webhookCallback(`/bot${process.env.SECRET_KEY}`));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Webhook set to ${URL}/bot${process.env.SECRET_KEY}`);
});

bot.launch();
