import { Scenes } from 'telegraf';
import { ScenesNames } from '../../../types/enums/ScenesNames.enum';
import { returnAction } from './actions';
import { getReturnKeyboard } from './helpers';
import { getMainKeyboard } from '../../utils/keyboard';

const about = new Scenes.BaseScene(ScenesNames.ABOUT_ME_SCENE);

about.enter(async ctx => {
  console.log('Entering to About action');

  await ctx.editMessageText(
    'Привет! С помощью меня ты можешь предложить любую новость, которую считаешь важной для канала Техлидер.рф.',
    getReturnKeyboard(),
  );
});

about.leave(async ctx => {
  console.log('Leaving About scene');
  const mainKeyboard = getMainKeyboard();

  await ctx.editMessageText('Чем могу помочь?', mainKeyboard);
});

about.action('return', returnAction);

export default about;
