import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';

import News from '../../models/News';
import { IBotContext } from '../../../types/interfaces/IBotContext';
import { getMainKeyboard } from '../../utils/keyboard';
import { Message } from 'telegraf/typings/core/types/typegram';

const news = new Scenes.BaseScene<any>(ScenesNames.NEWS_SCENE);

news.enter(async (ctx: IBotContext) => {
  await ctx.editMessageText('Отлично! Напишите свою новость текстом или пришлите видео/картинки');
});

news.on('text', async ctx => {
  const now = new Date().getTime();

  const newNews = new News({
    _id: ctx.message.message_id,
    created: now,
    text: (ctx.message as Message.TextMessage).text,
    // eslint-disable-next-line camelcase
    file_id: null,
  });

  await newNews.save();

  await ctx.reply('Спасибо за предложенную новость! Мы уведомим вас, если она нам понравится!');
  await ctx.scene.leave();
});

news.on('photo', async ctx => {
  const now = new Date().getTime();

  console.log(ctx.message);

  const fileLink = await ctx.telegram.getFileLink(ctx.message.photo.pop()!.file_id);

  const newNews = new News({
    _id: ctx.message.message_id,
    created: now,
    text: ctx.message.caption,
    fileLink,
  });

  await newNews.save();

  await ctx.reply('Спасибо за предложенные картинки! Мы уведомим вас, если она нам понравится!');
  await ctx.scene.leave();
});

news.on('video', async ctx => {
  const now = new Date().getTime();
  const fileLink = await ctx.telegram.getFileLink(ctx.message.video.file_id);

  const newNews = new News({
    _id: ctx.message.message_id,
    created: now,
    text: ctx.message.caption,
    fileLink,
  });

  await newNews.save();
  await ctx.reply('Спасибо за предложенное видео! Мы уведомим вас, если оно нам понравится!');
  await ctx.scene.leave();
});

news.leave(async (ctx: IBotContext) => {
  console.log('Leaving News scene');
  const mainKeyboard = getMainKeyboard();

  await ctx.reply('Чем могу помочь?', mainKeyboard);
});

export default news;
