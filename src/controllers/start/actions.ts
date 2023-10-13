import User from '../../models/User';

export const saveUserToDb = async (ctx): Promise<void> => {
  console.log('Saving user to DB');

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
  await ctx.scene.leave();
};
