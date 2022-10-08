const TelegramApi = require('node-telegram-bot-api');

const token = '5309505490:AAEqJfS7Yjbu5sFGCyqPnTc6Oww0MS8GKaU';

const bot = new TelegramApi(token, { polling: true });

const START_MESSAGE = 'Start Message';
const INFO = 'Info Message';
const UNKNOWN = 'Unknown ASS command';

const commands = [
  { command: '/start', description: 'Start Bot' },
  { command: '/info', description: 'get commans' },
  { command: '/buttons', description: 'get commans' },
];

const buttonsOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Текст кнопки 1', callback_data: '1' }],
      [{ text: 'Текст кнопки 2', callback_data: '2' }],
    ],
  }),
};

const startApp = () => {
  bot.setMyCommands(commands);

  bot.on('message', async (msg) => {
    const { message_id, from, chat, date, text } = msg;
    const chat_id = chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chat_id,
        'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/2.webp',
      );
      return bot.sendMessage(chat_id, START_MESSAGE);
    }
    if (text === '/info') {
      return bot.sendMessage(chat_id, INFO);
    }
    if (text === '/buttons') {
      return bot.sendMessage(chat_id, 'asadasdad', buttonsOptions);
    }

    await bot.sendSticker(
      chat_id,
      'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/256/43.webp',
    );
    return bot.sendMessage(chat_id, UNKNOWN);
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    return bot.sendMessage(chatId, `ты выбрал кнопку ${data}`);
  });
};

startApp();
