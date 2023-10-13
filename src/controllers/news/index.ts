import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';

import News from '../../models/News';
import { IBotContext } from '../../../types/interfaces/IBotContext';
import { getMainKeyboard } from '../../utils/keyboard';
import { Message } from 'telegraf/typings/core/types/typegram';
import User from '../../models/User';
import { getReturnKeyboard } from './helpers';

const news = new Scenes.BaseScene<any>(ScenesNames.NEWS_SCENE);

news.enter(async (ctx: IBotContext) => {
  await ctx.editMessageText(
    'Отлично! Напишите свою новость текстом или пришлите видео/картинки',
    getReturnKeyboard(),
  );
});

news.action('return', async ctx => {
  await ctx.deleteMessage();
  await ctx.scene.leave();
});

news.on('text', async ctx => {
  const now = new Date().getTime();

  const user = await User.findById(ctx.from.id);

  const newNews = new News({
    _id: ctx.message.message_id,
    user,
    created: now,
    text: (ctx.message as Message.TextMessage).text,
    fileId: null,
    fileLink: null,
    type: 'text',
  });

  await newNews.save();

  await ctx.reply('Спасибо за предложенную новость! Мы уведомим вас, если она нам понравится!');
  await ctx.scene.leave();
});

news.on('photo', async ctx => {
  const now = new Date().getTime();

  const fileId = ctx.message.photo.pop()!.file_id;
  const fileLink = await ctx.telegram.getFileLink(fileId);

  const user = await User.findById(ctx.from.id);

  const newNews = new News({
    _id: ctx.message.message_id,
    user,
    created: now,
    text: ctx.message.caption,
    fileId,
    fileLink,
    type: 'photo',
  });

  await newNews.save();

  await ctx.reply('Спасибо за предложенные картинки! Мы уведомим вас, если она нам понравится!');
  await ctx.scene.leave();
});

news.on('video', async ctx => {
  const now = new Date().getTime();

  const fileId = ctx.message.video.file_id;
  const fileLink = await ctx.telegram.getFileLink(fileId);

  const user = await User.findById(ctx.from.id);

  const newNews = new News({
    _id: ctx.message.message_id,
    user,
    created: now,
    text: ctx.message.caption,
    fileId,
    fileLink,
    type: 'video',
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
