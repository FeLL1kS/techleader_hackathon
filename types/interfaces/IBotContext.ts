import { Context } from 'telegraf';
import { SceneContextScene } from 'telegraf/typings/scenes';

export interface ISessionData {
  name: string;
}

export interface IBotContext extends Context {
  session: ISessionData;
  scene: SceneContextScene<any, any>;
}
