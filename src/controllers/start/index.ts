import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';
import { getCommandsKeyboard } from './helpers';
import User from '../../models/User';
import { saveUserToDb } from './actions';
import { getMainKeyboard } from '../../utils/keyboard';
import { IBotContext } from 'types/interfaces/IBotContext';

const start = new Scenes.BaseScene<any>(ScenesNames.START_SCENE);

start.enter(async (ctx: IBotContext) => {
  console.log('Entering to Start scene');
  const uid = String(ctx.from!.id);
  const user = await User.findById(uid);

  if (user) {
    console.log('User already exists');

    const mainKeyboard = getMainKeyboard();

    await ctx.reply('С возвращением! Чем могу помочь?', mainKeyboard);
  } else {
    await ctx.reply(
      // eslint-disable-next-line max-len
      'Здравствуйте, добро пожаловать в бота канала Техлидеры.рф. Здесь вы можете предложить свою новость для публикации.\n\nДля начала пожалуйста подтвердите свое согласие на предоставление информации.',
      getCommandsKeyboard(),
    );
  }
});

start.leave(async ctx => {
  console.log('Leaving start scene');

  const mainKeyboard = getMainKeyboard();

  await ctx.editMessageText(
    'Отлично! Вот что я могу. Нажмите на любую интересующую вас кнопку:',
    mainKeyboard,
  );
});

start.action('agreed', saveUserToDb);

export default start;
