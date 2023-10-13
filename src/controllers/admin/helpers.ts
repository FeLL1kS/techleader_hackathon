import { Markup } from 'telegraf';

export const getAdminKeyboard = () =>
  Markup.inlineKeyboard([Markup.button.callback('Получить предложенные новости', 'getNews')]);
