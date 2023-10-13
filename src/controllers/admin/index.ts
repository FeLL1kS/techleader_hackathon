import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';
import { IBotContext } from '../../../types/interfaces/IBotContext';
import { Message } from 'telegraf/typings/core/types/typegram';
import News from '../../models/News';
import { getMainKeyboard } from '../../utils/keyboard';

const admin = new Scenes.BaseScene<any>(ScenesNames.ADMIN_SCENE);

admin.enter(async (ctx: IBotContext) => {
  await ctx.reply(
    // eslint-disable-next-line max-len
    'Добро пожаловать в панель администратора! Чтобы получить присланные новости введите даты в формате ГГГГ.ММ.ДД-ГГГГ.ММ.ДД',
  );
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

  const news = await News.find({ created: { $gte: startDateMs, $lte: endDateMs } });

  if (!news.length) {
    ctx.reply(`Новостей за промежуток ${text} нет`);

    return;
  }

  news.map(n => {
    switch (n.type) {
      case 'text':
        ctx.reply(`Новость от ${'id'}\n\n${n.text ? n.text : ''}`);
        break;
      case 'photo':
        ctx.replyWithPhoto(n.fileId!, { ...(n.text && { caption: n.text }) });
        break;
      case 'video':
        ctx.replyWithVideo(n.fileId!, { ...(n.text && { caption: n.text }) });
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
