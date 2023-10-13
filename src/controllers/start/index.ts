import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';
import { getCommandsKeyboard } from './helpers';
import User from '../../models/User';

const start = new Scenes.BaseScene(ScenesNames.START_SCENE);

start.enter(async ctx => {
  const uid = String(ctx.from!.id);
  const user = await User.findById(uid);

  if (user) {
    await ctx.reply('С возвращением!');
  } else {
    await ctx.reply(
      // eslint-disable-next-line max-len
      'Здравствуйте, добро пожаловать в бота канала Техлидеры.рф. Здесь вы можете предложить свою новость для публикации. Для начала пожалуйста подтвердите свое согласие на предоставление информации.',
      getCommandsKeyboard(),
    );
  }
});

start.action('agreed', async ctx => {
  const uid = String(ctx.from!.id);
  const now = new Date().getTime();

  const newUser = new User({
    _id: uid,
    created: now,
    username: ctx.from!.username,
    name: ctx.from!.first_name + ' ' + (ctx.from!.last_name || ''),
    observableMovies: [],
    lastActivity: now,
    totalMovies: 0,
    language: 'en',
  });

  await newUser.save();
  await ctx.editMessageText('Отлично! Теперь вы можете ввести предлагаемую новость.', {});
});

export default start;
