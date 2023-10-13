import { Markup } from 'telegraf';

export const getApproveKeyboard = (userId: string, newsId: string) =>
  Markup.inlineKeyboard([Markup.button.callback('Одобрить', `approve-${userId}-${newsId}`)]);

export const getRatingKeyboard = (userId: string, newsId: string) => [
  [Markup.button.callback('Пожалуйста оцените новость', '-')],
  [
    Markup.button.callback('1', `rate-1-${userId}-${newsId}`),
    Markup.button.callback('2', `rate-2-${userId}-${newsId}`),
    Markup.button.callback('3', `rate-3-${userId}-${newsId}`),
    Markup.button.callback('4', `rate-4-${userId}-${newsId}`),
    Markup.button.callback('5', `rate-5-${userId}-${newsId}`),
  ],
];

export const getReturnKeyboard = () =>
  Markup.inlineKeyboard([Markup.button.callback('Обратно', 'return', false)]);
