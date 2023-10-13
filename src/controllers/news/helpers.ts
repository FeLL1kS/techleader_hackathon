import { Markup } from 'telegraf';

export const getReturnKeyboard = () =>
  Markup.inlineKeyboard([Markup.button.callback('Обратно', 'return', false)]);
