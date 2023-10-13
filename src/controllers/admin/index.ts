import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';
import { IBotContext } from '../../../types/interfaces/IBotContext';
import { Message } from 'telegraf/typings/core/types/typegram';
import News from '../../models/News';
import { getMainKeyboard } from '../../utils/keyboard';
import { getApproveKeyboard, getRatingKeyboard, getReturnKeyboard } from './helpers';

const admin = new Scenes.BaseScene<any>(ScenesNames.ADMIN_SCENE);

admin.enter(async (ctx: IBotContext) => {
  await ctx.reply(
    // eslint-disable-next-line max-len
    'Добро пожаловать в панель администратора! Чтобы получить присланные новости введите даты в формате ГГГГ.ММ.ДД-ГГГГ.ММ.ДД',
    getReturnKeyboard(),
  );
});

admin.action('return', async ctx => {
  await ctx.deleteMessage();
  await ctx.scene.leave();
});

admin.action(/^approve-(\d+)-(\d+)$/, async ctx => {
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
});

admin.action(/^rate-(\d+)-(\d+)-(\d+)$/, async ctx => {
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
});

admin.command('saveme', async ctx => {
  await ctx.scene.leave();
});

admin.on('message', async ctx => {
  const regex = new RegExp(/\d{4}\.\d{2}\.\d{2}-\d{4}\.\d{2}\.\d{2}/g);

  const text = (ctx.message as Message.TextMessage).text;

  if (!regex.exec(text)) {
    await ctx.reply(
      'Неверный формат даты. введите даты в формате ГГГГ.ММ.ДД-ГГГГ.ММ.ДД. Чтобы выйти на главную напишите /saveme',
    );

    return;
  }

  const [startDate, endDate] = text.split('-');

  const startDateMs = new Date(startDate).getTime();
  const endDateMs = new Date(endDate).getTime();

  const news = await News.find({
    created: { $gte: startDateMs, $lte: endDateMs },
    rating: { $eq: null },
  });

  if (!news.length) {
    ctx.reply(`Новостей за промежуток ${text} нет`);

    return;
  }

  news.map(n => {
    switch (n.type) {
      case 'text':
        ctx.reply(
          `Новость от ${'id'}\n\n${n.text ? n.text : ''}`,
          n.user && n.id ? getApproveKeyboard(n.user._id, n.id) : {},
        );
        break;
      case 'photo':
        ctx.replyWithPhoto(n.fileId!, {
          ...(n.user ? getApproveKeyboard(n.user._id, n.id) : {}),
          ...(n.text && { caption: n.text }),
        });
        break;
      case 'video':
        ctx.replyWithVideo(n.fileId!, {
          ...(n.user && n.id ? getApproveKeyboard(n.user._id, n.id) : {}),
          ...(n.text && { caption: n.text }),
        });
        break;
    }
  });
});

admin.leave(async ctx => {
  console.log('Leaving start scene');

  const mainKeyboard = getMainKeyboard();

  await ctx.reply(
    'Отлично! Вот что я могу. Нажмите на любую интересующую вас кнопку:',
    mainKeyboard,
  );
});

export default admin;
