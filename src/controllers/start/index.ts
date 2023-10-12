import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';

const start = new Scenes.BaseScene(ScenesNames.START_SCENE);

start.enter(async ctx => {
  await ctx.reply('Hello World!');
});

export default start;
