/* eslint-disable no-console */
import { Markup } from 'telegraf';

export const getCommandsKeyboard = () =>
  Markup.inlineKeyboard([Markup.button.callback('Я согласен', 'agreed', false)]);
