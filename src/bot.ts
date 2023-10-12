import dotenv from 'dotenv';

dotenv.config();

import { Scenes, Telegraf, session } from 'telegraf';
import startScene from './controllers/start';
import { IBotContext } from 'types/interfaces/IBotContext';
import { ScenesNames } from '../types/enums/ScenesNames.enum';

const bot = new Telegraf<IBotContext>(process.env.BOT_TOKEN!);

const stages = new Scenes.Stage<any>([startScene]);

bot.use(session());
bot.use(stages.middleware());

bot.start(async ctx => ctx.scene.enter(ScenesNames.START_SCENE));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
