import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';
import { IBotContext } from '../../../types/interfaces/IBotContext';
import { Message } from 'telegraf/typings/core/types/typegram';
import News from '../../models/News';
import { getMainKeyboard } from '../../utils/keyboard';
import { getAdminKeyboard, getApproveKeyboard } from './helpers';
import { approveAction, getApprovedNewsAction, rateAction, returnAction } from './actions';

const admin = new Scenes.BaseScene<any>(ScenesNames.ADMIN_SCENE);

admin.enter(async (ctx: IBotContext) => {
  await ctx.reply(
    // eslint-disable-next-line max-len
    'Добро пожаловать в панель администратора! Чтобы получить присланные новости введите даты в формате ГГГГ.ММ.ДД-ГГГГ.ММ.ДД',
    getAdminKeyboard(),
  );
});

admin.action('getApproved', getApprovedNewsAction);

admin.action('return', returnAction);

admin.action(/^approve-(\d+)-(\d+)$/, approveAction);

admin.action(/^rate-(\d+)-(\d+)-(\d+)$/, rateAction);

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

  await Promise.all(
    news.map(async n => {
      switch (n.type) {
        case 'text':
          await ctx.reply(
            `Новость от ${'id'}\n\n${n.text ? n.text : ''}`,
            n.user && n.id ? getApproveKeyboard(n.user._id, n.id) : {},
          );
          break;
        case 'photo':
          await ctx.replyWithPhoto(n.fileId!, {
            ...(n.user ? getApproveKeyboard(n.user._id, n.id) : {}),
            ...(n.text && { caption: n.text }),
          });
          break;
        case 'video':
          await ctx.replyWithVideo(n.fileId!, {
            ...(n.user && n.id ? getApproveKeyboard(n.user._id, n.id) : {}),
            ...(n.text && { caption: n.text }),
          });
          break;
      }
    }),
  );
});

admin.leave(async ctx => {
  console.log('Leaving start scene');

  const mainKeyboard = getMainKeyboard();

  await ctx.reply('Чем могу помочь?', mainKeyboard);
});

export default admin;
