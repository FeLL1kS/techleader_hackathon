import News from '../../models/News';
import { getRatingKeyboard } from './helpers';

export const getApprovedNewsAction = async ctx => {
  await ctx.deleteMessage();

  const news = await News.find({
    isApproved: true,
  });

  if (!news.length) {
    ctx.reply('Одобренных новостей нет');

    return;
  }

  await Promise.all(
    news.map(async n => {
      switch (n.type) {
        case 'text':
          await ctx.reply(`Новость от ${'id'}\n\n${n.text ? n.text : ''}`);
          break;
        case 'photo':
          await ctx.replyWithPhoto(n.fileId!, { ...(n.text && { caption: n.text }) });
          break;
        case 'video':
          await ctx.replyWithVideo(n.fileId!, { ...(n.text && { caption: n.text }) });
          break;
      }
    }),
  );

  await ctx.scene.leave();
};

export const returnAction = async ctx => {
  await ctx.deleteMessage();
  await ctx.scene.leave();
};

export const approveAction = async ctx => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, userId, newsId] = ctx.match;

  await News.updateOne({ _id: newsId }, { isApproved: true });

  await ctx.editMessageReplyMarkup({
    // eslint-disable-next-line camelcase
    inline_keyboard: [...getRatingKeyboard(userId, newsId)],
  });
  await ctx.telegram.sendMessage(
    userId,
    'Ваша новость была одобрена и скоро ее запостят на нашем основном канале!',
  );
};

export const rateAction = async ctx => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, rating, userId, newsId] = ctx.match;

  await News.updateOne({ _id: newsId }, { rating });

  await ctx.editMessageReplyMarkup({
    // eslint-disable-next-line camelcase
    inline_keyboard: [
      [
        {
          text: 'Спасибо за оценку',
          // eslint-disable-next-line camelcase
          callback_data: '-',
        },
      ],
    ],
  });
  await ctx.telegram.sendMessage(userId, `Ваша новость была оценена на ${rating} баллов`);
};
