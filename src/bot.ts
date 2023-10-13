import dotenv from 'dotenv';

dotenv.config();

import { Scenes, Telegraf, session } from 'telegraf';
import startScene from './controllers/start';
import aboutScene from './controllers/about';
import { IBotContext } from 'types/interfaces/IBotContext';
import { ScenesNames } from '../types/enums/ScenesNames.enum';
import mongoose from 'mongoose';
import { getMainKeyboard } from './utils/keyboard';

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DATABASE_HOST}`);
mongoose.connection.on('error', err => {
  console.error(
    `Error occurred during an attempt to establish connection with the database: ${err}`,
  );
  process.exit(1);
});

mongoose.connection.on('open', () => {
  const bot = new Telegraf<IBotContext>(process.env.BOT_TOKEN!);

  const stages = new Scenes.Stage<any>([startScene, aboutScene]);

  bot.use(session());
  bot.use(stages.middleware());

  bot.start(async ctx => ctx.scene.enter(ScenesNames.START_SCENE));

  bot.action('about', async ctx => ctx.scene.enter(ScenesNames.ABOUT_ME_SCENE));

  bot.command('saveme', async (ctx: IBotContext) => {
    const mainKeyboard = getMainKeyboard();

    await ctx.reply(
      'Отлично! Вот что я могу. Нажмите на любую интересующую вас кнопку:',
      mainKeyboard,
    );
  });

  bot.launch();

  bot.on('message', async ctx => {
    console.log('Default Message');

    await ctx.reply('Я тебя не понял, пожалуйста выбери одну из команд ниже.', getMainKeyboard());
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
});
