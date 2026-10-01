const { Telegraf, Markup, session } = require("telegraf"); 
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const moment = require("moment-timezone");
const {
  makeWASocket,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
  generateWAMessageFromContent,
  generateWAMessage,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const axios = require("axios");
const readline = require('readline');
const { BOT_TOKEN, OWNER_IDS } = require("./flexer");
const crypto = require("crypto");
let danzy = null;
let bots = [];
const bot = new Telegraf(BOT_TOKEN);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const premiumFile = "./database/premiums.json";
const adminFile = "./database/admins.json";

const loadJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error(chalk.red(`Gagal memuat file ${filePath}:`), err);
    return [];
  }
};

const saveJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

let adminUsers = loadJSON(adminFile);
let premiumUsers = loadJSON(premiumFile);

const checkOwner = (ctx, next) => {
  const userId = ctx.from.id.toString(); 
  if (!OWNER_IDS.includes(userId)) {
    return ctx.reply("❗Mohon Maaf Fitur Ini Khusus Owner");
  }

  return next();
};

const checkAdmin = (ctx, next) => {
  if (!adminUsers.includes(ctx.from.id.toString())) {
    return ctx.reply("❗ Mohon Maaf Fitur Ini Khusus Admin.");
  }
  next();
};

const checkPremium = (ctx, next) => {
  if (!premiumUsers.includes(ctx.from.id.toString())) {
    return ctx.reply("❗ Mohon Maaf Fitur Ini Khusus Premium.");
  }
  next();
};

const addAdmin = (userId) => {
  if (!adminUsers.includes(userId)) {
    adminUsers.push(userId);
    saveJSON(adminFile, adminUsers);
  }
};

const removeAdmin = (userId) => {
  adminUsers = adminUsers.filter((id) => id !== userId);
  saveJSON(adminFile, adminUsers);
};

const addPremium = (userId) => {
  if (!premiumUsers.includes(userId)) {
    premiumUsers.push(userId);
    saveJSON(premiumFile, premiumUsers);
  }
};

const removePremium = (userId) => {
  premiumUsers = premiumUsers.filter((id) => id !== userId);
  saveJSON(premiumFile, premiumUsers);
};
bot.use(session());

const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const question = (query) =>
  new Promise((resolve) => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });

//////// FUNGSI VALID TOKEN \\\\\\\\\
const GITHUB_TOKEN_LIST_URL = "https://github.com/flexer09/Main/commit/da830e01e13737d845c782a489f7b65fcbd25785";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens || [];
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa apakah token bot valid..."));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red("═══════════════════════════════════════════"));
    console.log(chalk.bold.blue("LU SIAPA KONTOL. ADD TOKEN DULU SAMA DANZY SANA"));
    console.log(chalk.red("═══════════════════════════════════════════"));
    process.exit(1);
  }

  console.log(chalk.green("✅ Token Anda Terdaftar Di Database"));
  startBot(); 
}

function startBot() {
 console.clear();
  console.log(
    chalk.green(`
   [ SUCCES TERHUBUNG ]
| NAME BOT : FLEXER XVISIBLE |
| VERSION BOT : 4.0 TRACK    |
| LANGUAGE : JAVASCRIPT  |
| TYPE : BOT TELEGRAM |
| FUNGSI BOT : MENGIRIM BUG WHATSAPP  |
| API BUG : SEDANG AKTIF ✅ |
| NOTE : GUNAKAN BOT SEBAIK MUNGKIN & JANGAN TERLALU SPAM! |
| SCRIPT KESEBAR? GA UPDATE SC LAGI! |
|
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| #danzy |
| SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - SCROL KE ATAS BODOH!😹 - |
`));
}

validateToken();

//======[ random image ]======
const randomImages = [
"https://files.catbox.moe/vq0w8g.jpg",
];
const getRandomImage = () =>
  randomImages[Math.floor(Math.random() * randomImages.length)];
  
////=========MENU UTAMA========\\\\
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const isPremium = premiumUsers.includes(userId);
  const Name = ctx.from.username ? `@${ctx.from.username}` : userId;
  const waktuRunPanel = getUptime();
  
  const mainMenuMessage = `\`\`\`${Name}
( ! ) Привет, пользователи ботов! Это бот-жучок 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽—𝗕𝘂𝗴 через 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺. Пожалуйста, используйте моего бота Telegram. Не спамьте, бро. \`\`\`
—( 𝙁𝙇𝙀𝙓𝙀𝙍 𝗫𝘃𝗶𝘀𝗶𝗯𝗹𝗲)—
以 —𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 : 𝙁𝙇𝙀𝙓𝙀𝙍 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲
以 —𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 𝗗𝗲𝘃 : @LG_FLEXERX
以 —𝗩𝗲𝗿𝘀𝗶𝗼𝗻 𝗕𝗼𝘁 : 𝟰.𝟬
以 —𝗨𝗽𝘁𝗶𝗺𝗲 : ${waktuRunPanel}

(#) 𝗣𝗹𝗲𝗮𝘀𝗲 𝗦𝗲𝗹𝗲𝗰𝘁 𝗕𝘂𝘁𝘁𝗼𝗻 𝗕𝗲𝗹𝗼𝘄
`;

  const mainKeyboard = [
    [
      {
        text: "👾 𝘽𝙐𝙂 𝙈𝙀𝙉𝙐",
        callback_data: "bug_menu",
      },
      {
        text: "👤 𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙉𝙐",
        callback_data: "owner_menu",
      },
    ],
    [
      {
        text: "𝙊𝙒𝙉𝙀𝙍",
        url: "https://t.me/LG_FLEXERX",
      },
    ],
  ];

  await ctx.replyWithPhoto(getRandomImage(), {
    caption: mainMenuMessage,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: mainKeyboard,
    },
  });
});


bot.action("owner_menu", async (ctx) => {
  const userId = ctx.from.id.toString();
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();
 
      const mainMenuMessage = `\`\`\`${Name}
( ! ) Привет, пользователи ботов! Это бот-жучок 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽—𝗕𝘂𝗴 через 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺. Пожалуйста, используйте моего бота Telegram. Не спамьте, бро. \`\`\`
—( 𝙁𝙇𝙀𝙓𝙀𝙍 𝗫𝘃𝗶𝘀𝗶𝗯𝗹𝗲)—
以 —𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 : 𝙁𝙇𝙀𝙓𝙀𝙍 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲
以 —𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 𝗗𝗲𝘃 : @LG_FLEXERX
以 —𝗩𝗲𝗿𝘀𝗶𝗼𝗻 𝗕𝗼𝘁 : 𝟰.𝟬
以 —𝗨𝗽𝘁𝗶𝗺𝗲 : ${waktuRunPanel}

╒┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┃立 —/addprem <users-id>
┃-» Add Acces Bug
┃立 —/delprem <users-id>
┃-» Del Acces Bug
┃立 —/cekprem
┃-» Chek User Prem
┃立 —/addadmin <users-id>
┃-» Add Acces Addprem/Delprem & Acces Bug
┃立 —/deladmin <users-id>
┃-» Del Acces Addprem/Delprem & Acces Bug
╘┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
`;

  const media = {
    type: "photo",
    media: getRandomImage(), 
    caption: mainMenuMessage,
    parse_mode: "Markdown"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "⬅️ 𝖪𝖾𝗆𝖻𝖺𝗅𝗂", callback_data: "back" }],
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});

bot.action("bug_menu", async (ctx) => {
  const userId = ctx.from.id.toString();
  const Name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.id}`;
  const waktuRunPanel = getUptime();
      
  const mainMenuMessage = `\`\`\`${Name}
( ! ) Привет, пользователи ботов! Это бот-жучок 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽—𝗕𝘂𝗴 через 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺. Пожалуйста, используйте моего бота Telegram. Не спамьте, бро. \`\`\`
—( 𝙁𝙇𝙀𝙓𝙀𝙍 𝗫𝘃𝗶𝘀𝗶𝗯𝗹𝗲)—
以 —𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 : 𝙁𝙇𝙀𝙓𝙀𝙍 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲
以 —𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 𝗗𝗲𝘃 : @LG_FLEXERX
以 —𝗩𝗲𝗿𝘀𝗶𝗼𝗻 𝗕𝗼𝘁 : 𝟰.𝟬
以 —𝗨𝗽𝘁𝗶𝗺𝗲 : ${waktuRunPanel}

( © ) —𝖲𝗉𝖾𝖼𝗂𝖺𝗅×𝖡𝗎𝗀𝗌
╒┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┃立 —/forceclose 62xxx
┃—≥ Force Close Api Invisible
╘┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
╒┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┃立 —/dellaytrash 62xxx
┃—≥ Dellay Api Invisible 
╘┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅

Note : Silahkan Pakai Fitur Bug Di Atas. Kamu Tidak Perlu Add Sender Lagi!. Dan Jangan Terlalu Spam!!
`;

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "Markdown"
  };

  const keyboard = {
    inline_keyboard: [
      [{ text: "⬅️ 𝖪𝖾𝗆𝖻𝖺𝗅𝗂", callback_data: "back" }],
    ],
  };

  try {
    await ctx.editMessageMedia(media, { reply_markup: keyboard });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: keyboard,
    });
  }
});

bot.action("back", async (ctx) => {
  const userId = ctx.from.id.toString();
  const isPremium = premiumUsers.includes(userId);
  const Name = ctx.from.username ? `@${ctx.from.username}` : userId;
  const waktuRunPanel = getUptime();

  const mainMenuMessage = `\`\`\`${Name}
( ! ) Привет, пользователи ботов! Это бот-жучок 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽—𝗕𝘂𝗴 через 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺. Пожалуйста, используйте моего бота Telegram. Не спамьте, бро. \`\`\`
—( 𝙁𝙇𝙀𝙓𝙀𝙍 𝗫𝘃𝗶𝘀𝗶𝗯𝗹𝗲)—
以 —𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 : 𝙁𝙇𝙀𝙓𝙀𝙍 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲
以 —𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 𝗗𝗲𝘃 : @LG_FLEXERX
以 —𝗩𝗲𝗿𝘀𝗶𝗼𝗻 𝗕𝗼𝘁 : 𝟰.𝟬
以 —𝗨𝗽𝘁𝗶𝗺𝗲 : ${waktuRunPanel}

(#) 𝗣𝗹𝗲𝗮𝘀𝗲 𝗦𝗲𝗹𝗲𝗰𝘁 𝗕𝘂𝘁𝘁𝗼𝗻 𝗕𝗲𝗹𝗼𝘄
`;

  const media = {
    type: "photo",
    media: getRandomImage(),
    caption: mainMenuMessage,
    parse_mode: "Markdown"
  };

  const mainKeyboard = [
    [
      {
        text: "👾 𝘽𝙐𝙂 𝙈𝙀𝙉𝙐",
        callback_data: "bug_menu",
      },
      {
        text: "👤 𝙊𝙒𝙉𝙀𝙍 𝙈𝙀𝙉𝙐",
        callback_data: "owner_menu",
      },
    ],
    [
      {
        text: "𝙊𝙒𝙉𝙀𝙍",
        url: "https://t.me/LG_FLEXERX",
      },
    ],
  ];

  try {
    await ctx.editMessageMedia(media, { reply_markup: { inline_keyboard: mainKeyboard } });
  } catch (err) {
    await ctx.replyWithPhoto(media.media, {
      caption: media.caption,
      parse_mode: media.parse_mode,
      reply_markup: { inline_keyboard: mainKeyboard },
    });
  }
});

bot.command("forceclose", checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`Example: /forceclose 62xxxx`);
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  try {
    const res = await fetch(`API_BUG_MU`);
    const json = await res.json();

    if (!json.success) {
      return ctx.reply(`❌ Gagal kirim bug: ${json.error || "unknown error"}`);
    }

    ctx.reply(`✅ Berhasil kirim bug force close ke ${target}`);
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Terjadi kesalahan saat mengirim bug.');
  }
});

bot.command("dellaytrash", checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`⚠️ Contoh penggunaan:\n/dellaytrash 628xxxx`);

  const nomor = q.replace(/[^0-9]/g, "");
  const target = `${nomor}@s.whatsapp.net`;

  try {
    const res = await fetch(`API_BUG_MU`);
    const json = await res.json();

    if (!json.success) {
      return ctx.reply(`❌ Gagal kirim bug: ${json.error || "unknown error"}`);
    }

    ctx.reply(`✅ Berhasil kirim bug dellay ke ${target}`);
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Terjadi kesalahan saat mengirim bug.');
  }
});

bot.command("addadmin", checkOwner, (ctx) => {
  const args = ctx.message.text.split(" ");



  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example: /addadmin 12345678"
    );
  }

  const userId = args[1];

  if (adminUsers.includes(userId)) {
    return ctx.reply(`✅ Pengguna ${userId} sudah memiliki status admin.`);
  }

  adminUsers.push(userId);
  saveJSON(adminFile, adminUsers);

  return ctx.reply(`✅ Pengguna ${userId} sekarang memiliki akses admin!`);
});
bot.command("addprem", checkAdmin, (ctx) => {
  const args = ctx.message.text.trim().split(" "); 

  if (args.length < 2) {
    return ctx.reply("❌ Format Salah!. Example : /addprem 12345678");
  }

  const userId = args[1].toString();

  if (premiumUsers.includes(userId)) {
    return ctx.reply(`✅ Pengguna ${userId} sudah memiliki akses premium.`);
  }

  premiumUsers.push(userId);
  saveJSON(premiumFile, premiumUsers);

  return ctx.reply(`✅ Pengguna ${userId} sekarang adalah premium.`);
});

bot.command("deladmin", checkOwner, (ctx) => {
  const args = ctx.message.text.split(" ");



  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example : /deladmin 12345678"
    );
  }

  const userId = args[1];

  if (!adminUsers.includes(userId)) {
    return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar Admin.`);
  }

  adminUsers = adminUsers.filter((id) => id !== userId);
  saveJSON(adminFile, adminUsers);

  return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari daftar Admin.`);
});

bot.command("delprem", checkAdmin, (ctx) => {
  const args = ctx.message.text.trim().split(" ");

  if (args.length < 2) {
    return ctx.reply(
      "❌ Format Salah!. Example : /delprem 12345678"
    );
  }

  const userId = args[1].toString();

  if (!premiumUsers.includes(userId)) {
    return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar premium.`);
  }

  premiumUsers = premiumUsers.filter((id) => id !== userId);
  saveJSON(premiumFile, premiumUsers);

  return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari akses premium.`);
});

bot.command("cekprem", (ctx) => {
  const userId = ctx.from.id.toString();

  if (premiumUsers.includes(userId)) {
    return ctx.reply(`✅ Anda adalah pengguna premium.`);
  } else {
    return ctx.reply(`❌ Anda bukan pengguna premium.`);
  }
});

// --- Jalankan Bot ---
console.log("Succes Connect");
bot.launch();

console.clear();

console.log(
  chalk.bold.white(`
`)
);