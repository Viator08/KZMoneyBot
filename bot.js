require('dotenv').config();
const { increase, decrease, balance } = require('./googleSheets.js');

const text = require('./utils/commands.js');
const { Telegraf, Markup } = require('telegraf');

const myBot = function () {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => {
    ctx.replyWithSticker(
      'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/2.webp',
    );
    ctx.sendMessage('Hi there!');
  });
  bot.help((ctx) => ctx.reply(text.commands));
  bot.command('payments', async (ctx) => {
    try {
      const username = ctx.update.message.from.username;
      const nameHoma = ['хомякам', 'homa'];
      const nameDima = ['Диме', 'dima'];
      const nameSasha = ['Саше', 'sasha'];

      let name1;
      let name2;

      if (username === 'Viator08') {
        name1 = nameHoma;
        name2 = nameDima;
      } else if (username === 'MrFeyman') {
        name1 = nameHoma;
        name2 = nameSasha;
      } else {
        name1 = nameDima;
        name2 = nameSasha;
      }

      await ctx.replyWithHTML(
        '<b>Внести платежи</b>',
        Markup.inlineKeyboard([
          [Markup.button.callback('Я потратил', 'btn_i_spend')],
          [
            Markup.button.callback(`Я вернул ${name1[0]}`, `btn_i_return_${name1[1]}`),
            Markup.button.callback(`Я вернул ${name2[0]}`, `btn_i_return_${name2[1]}`),
          ],
        ]),
      );
    } catch (error) {
      console.log(error);
    }
  });

  bot.command('balance', async (ctx) => {
    try {
      const username = ctx.update.message.from.username;

      const { debt1, person1, debt2, person2 } = await balance(username);

      await ctx.sendMessage(`ты должен ${debt1} отдать ${person1} и ${debt2} отдать ${person2}`);
      return ctx.sendSticker(
        'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/256/83.webp',
      );
    } catch (error) {
      console.log(error);
    }
  });

  function increaseBot() {
    bot.on('message', async (ctx) => {
      const sum = parseInt(ctx.update.message.text);
      const from = ctx.update.message.from;
      increase(from.username, sum);
      await ctx.sendMessage(
        `Платеж принят, ${from.first_name ? from.first_name : from.username}! Ты потратил ${sum}`,
      );
      return ctx.sendSticker(
        'tlgrm.eu/_/stickers/411/0d5/4110d5e2-23de-4001-9ff8-a288caa6cb64/192/1.webp',
      );
    });
  }

  function decreaseBot(user2) {
    bot.on('message', async (ctx) => {
      const sum = parseInt(ctx.update.message.text);
      const from = ctx.update.message.from;
      decrease(from.username, user2, sum);
      await ctx.sendMessage(
        `платеж принят, ${from.first_name ? from.first_name : from.username}! Ты вернул @${user2} ${
          ctx.update.message.text
        }`,
      );
      return ctx.sendSticker(
        'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp',
      );
    });
  }

  function addActionBot(btnName, text, src, fn, user2) {
    bot.action(btnName, async (ctx) => {
      try {
        await ctx.answerCbQuery();
        if (src) {
          ctx.replyWithSticker(src);
        }
        ctx.replyWithHTML(text, {
          disable_web_page_preview: true,
        });
        if (user2) return fn(user2);
        return fn();
      } catch (error) {
        console.log(error);
      }
    });
  }

  addActionBot(
    'btn_i_spend',
    'Введи сколько ты потратил',
    'https://tlgrm.eu/_/stickers/4e3/cbf/4e3cbff2-3564-4e57-b5bb-a4d4d473939f/9.webp',
    increaseBot,
  );

  addActionBot(
    'btn_i_return_homa',
    'Введи сколько ты вернул Хомякам',
    'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/256/99.webp',
    decreaseBot,
    'fuergrissaostdrauka',
  );

  addActionBot(
    'btn_i_return_dima',
    'Введи сколько ты вернул Диме',
    'https://tlgrm.eu/_/stickers/09b/9ed/09b9ed94-a5a4-37ad-88a1-a9206c8d1ac0/192/6.webp',
    decreaseBot,
    'MrFeyman',
  );

  addActionBot(
    'btn_i_return_sasha',
    'Введи сколько ты вернул Саше',
    'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/256/51.webp',
    decreaseBot,
    'Viator08',
  );

  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

module.exports = myBot;
