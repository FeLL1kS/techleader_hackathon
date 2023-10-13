import dotenv from 'dotenv';

dotenv.config();

import { Scenes, Telegraf, session } from 'telegraf';
import startScene from './controllers/start';
import { IBotContext } from 'types/interfaces/IBotContext';
import { ScenesNames } from '../types/enums/ScenesNames.enum';
import mongoose from 'mongoose';

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DATABASE_HOST}`);
mongoose.connection.on('error', err => {
  console.error(
    `Error occurred during an attempt to establish connection with the database: ${err}`,
  );
  process.exit(1);
});

mongoose.connection.on('open', () => {
  const bot = new Telegraf<IBotContext>(process.env.BOT_TOKEN!);

  const stages = new Scenes.Stage<any>([startScene]);

  bot.use(session());
  bot.use(stages.middleware());

  bot.start(async ctx => ctx.scene.enter(ScenesNames.START_SCENE));

  bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
});
