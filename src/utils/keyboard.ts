import { Markup } from 'telegraf';

export const getMainKeyboard = () => {
  const mainKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('Обо мне', 'about'),
      Markup.button.callback('Предложить новость', 'news'),
    ],
  ]);

  return mainKeyboard;
};
