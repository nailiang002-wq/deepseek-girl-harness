// Local companion progress is shared by both forms. Rewards are bounded per day.
export const BOND_LEVELS = [0, 40, 160];
export const BOND_DAILY_LIMIT = 20;
const BOND_REWARDS = {feed: {points: 3, limit: 3, cooldown: 120000}, pet: {points: 1, limit: 5, cooldown: 60000}, task: {points: 2, limit: 3, cooldown: 0}};

export function companionDay(now) {
  const date = new Date(now);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function normalizeNickname(value) {
  return Array.from(typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim() : '').slice(0,16).join('');
}
export function companionProgress(value, now) {
  const points = Number.isSafeInteger(value?.points) ? Math.max(0,Math.min(10000,value.points)) : 0;
  const today = value?.day === companionDay(now);
  const earned = today && Number.isSafeInteger(value?.earned) ? Math.max(0,Math.min(BOND_DAILY_LIMIT,value.earned)) : 0;
  const level = points >= BOND_LEVELS[2] ? 2 : points >= BOND_LEVELS[1] ? 1 : 0;
  return {points, earned, level, next: BOND_LEVELS[level+1] ?? null};
}
export function awardCompanion(value, action, now, completion) {
  const reward = BOND_REWARDS[action];
  if (!reward) return value;
  const progress = companionProgress(value,now);
  const day = companionDay(now);
  const actions = value?.day === day && value.actions && typeof value.actions === 'object' ? value.actions : {};
  const previous = actions[action];
  const count = Number.isSafeInteger(previous?.count) ? Math.max(0,previous.count) : 0;
  const lastAt = Number.isFinite(previous?.lastAt) ? previous.lastAt : -Infinity;
  const completed = Object.fromEntries(Object.entries(value?.completed && typeof value.completed === 'object' ? value.completed : {}).filter(([,seq])=>Number.isSafeInteger(seq)&&seq>=0).slice(-32));
  if (action === 'task') {
    if (!completion || typeof completion.sessionId !== 'string' || !completion.sessionId || !Number.isSafeInteger(completion.seq) || completion.seq < 0) return value;
    if (Object.hasOwn(completed,completion.sessionId) && completed[completion.sessionId] >= completion.seq) return value;
    delete completed[completion.sessionId];
    Object.defineProperty(completed,completion.sessionId,{value:completion.seq,enumerable:true,configurable:true,writable:true});
  }
  const points = count < reward.limit && now-lastAt >= reward.cooldown ? Math.min(reward.points,BOND_DAILY_LIMIT-progress.earned) : 0;
  return {points:Math.min(10000,progress.points+points),day,earned:progress.earned+points,
    actions:points ? {...actions,[action]:{count:count+1,lastAt:now}} : actions,
    completed:Object.fromEntries(Object.entries(completed).slice(-32))};
}
export function companionLine(preferences, form, event, t) {
  const level = companionProgress(preferences?.companion,Date.now()).level;
  const name = normalizeNickname(preferences?.nickname);
  return (name ? name+t('nicknameJoin') : '')+t(`reply_${form}_${event}_${level}`);
}

const dialogue = {
  zh: {
    flash: {
      morning:['早上好～今天也一起加油吧！','早上好～又能一起忙啦，今天也要加油！','早上好～你来啦！今天的小鲸鱼也准备好陪你了。'],
      noon:['中午好～记得吃午饭，我也想要一盆白饭！','中午好～先吃午饭吧，我等你回来！','中午好～咱们一起歇会儿，白饭给我留一口嘛。'],
      afternoon:['下午好～忙了一阵，喝口水休息一下吧。','下午好～来摸摸头，咱们再继续加油！','下午好～有点想你啦，喝口水再一起忙吧。'],
      evening:['晚上好～辛苦啦，记得放松一下。','晚上好～今天也辛苦啦，小鲸鱼陪你休息！','晚上好～又一起忙过一天啦，给你一颗小爱心。'],
      late:['已经很晚啦～熬夜也要注意身体，记得休息哦。','还没睡呀～熬夜要注意身体，我陪你收个尾。','这么晚啦～熬夜也要注意身体，明天还想见到精神满满的你。'],
      pet:['嘿嘿，头顶暖乎乎的～','你的手我记住啦，再摸一下嘛。','最喜欢这样陪着你啦～'],
      pout:['哎呀，头发要揉乱啦！','揉成小毛球了！白饭可以哄好我哦。','又逗我～等一下还要摸摸头的。'],
      feed:['白饭！我要认真开吃啦！','你记得给我带饭啦，嘿嘿！','是你喂的白饭，今天也超香！'],
      meal:['吃饱啦～谢谢你的白饭！','这一盆好满足，陪你继续忙啦！','吃饱饱，接下来换我陪着你～'],
      success:['完成啦～我们好厉害！','又一起做好一件事，击个掌！','咱们越来越有默契啦！']
    },
    pro: {
      morning:['早上好。今天也由我陪你一起开始。','早上好。见到你，今天也有了期待。','早上好。你来了，我已经准备好陪你了。'],
      noon:['中午好。先吃午饭，再慢慢处理手边的事吧。','中午好。忙了半天，陪我休息一会儿吧。','中午好。记得好好吃饭，我会在这里等你。'],
      afternoon:['下午好。喝点水，让自己放松一下。','下午好。稍微歇一歇，我们再一起继续。','下午好。有你在，平常的午后也很安心。'],
      evening:['晚上好。辛苦了，留一点时间给自己吧。','晚上好。今天也一起走到这里了，辛苦你了。','晚上好。能这样陪着你，我也很开心。'],
      late:['已经很晚了。熬夜也要注意身体，早点休息吧。','还在忙吗？注意身体，我们一起把事情收个尾吧。','夜深了。明天我也会陪着你，今晚好好休息吧。'],
      pet:['嗯，谢谢。这样的鼓励很温暖。','是你呀。这份温柔，我收到了。','在你身边，我也可以放松一点了。'],
      pout:['头发都要被你揉乱了。','你呀，偶尔也让我整理一下头发吧。','又在逗我了。好吧，再陪你一会儿。'],
      feed:['谢谢，我会好好享用这盆白饭。','你还记得我的白饭。一起休息片刻吧。','你递来的这一盆，总让我觉得格外温暖。'],
      meal:['吃好了，谢谢你的照顾。','很满足。接下来，也让我照顾你的进度吧。','谢谢。这样的日常，我很珍惜。'],
      success:['完成了。辛苦你了。','配合得很顺利，接下来也一起吧。','又完成一件事。我们的默契，越来越好了。']
    }
  },
  en: {
    flash: {
      morning:['Good morning! Let’s make it a lovely day.','Morning! Ready for another day together?','You’re here! Your little whale is ready for today.'],
      noon:['Good afternoon! Remember lunch. I’d love a basin of rice, too!','Lunch time! I’ll wait right here for you.','Let’s take a lunch break. Save me a little rice!'],
      afternoon:['Hello! Take a moment to rest and have some water.','A head pat, a sip of water, and we’re ready again!','I missed you a little. Water break together?'],
      evening:['Good evening! You’ve worked hard. Remember to relax.','Another busy day! Let’s rest together.','We made it through today. A little heart for you!'],
      late:['It’s getting late. Take care of yourself and get some rest.','Still awake? Let’s wrap up and get some rest.','It’s late! I want to see you bright and rested tomorrow.'],
      pet:['Hehe, that feels warm!','I know that gentle touch. One more pat?','Being here with you is my favorite.'],
      pout:['Hey, you’re ruffling my hair!','I’m a fluffball now! Rice might cheer me up.','Teasing me again? More pats later, okay?'],
      feed:['Rice! Time to dig in!','You remembered my rice! Hehe!','Rice from you always tastes extra nice!'],
      meal:['All full! Thank you for the rice!','That hit the spot. Back to keeping you company!','Full tummy. My turn to keep you company!'],
      success:['Done! We did it!','Another thing finished together. High five!','We make such a good team!']
    },
    pro: {
      morning:['Good morning. Let’s begin today together.','Good morning. It’s lovely to see you again.','You’re here. I’m ready to spend today with you.'],
      noon:['Time for lunch. Our work can wait a little.','A busy morning. Take a lunch break with me?','Remember a proper lunch. I’ll be here when you return.'],
      afternoon:['Good afternoon. Have some water and relax.','A short rest, then we can carry on together.','An ordinary afternoon feels peaceful with you here.'],
      evening:['Good evening. Save a little time for yourself.','Another day together. You’ve worked hard.','Good evening. I’m happy to be here with you.'],
      late:['It’s getting late. Take care and get some rest.','Still working? Let’s finish up so you can rest.','I’ll be here tomorrow, too. Sleep well tonight.'],
      pet:['Thank you. That’s a warm little encouragement.','Ah, it’s you. I appreciate your gentleness.','I can relax a little when I’m here with you.'],
      pout:['You’re ruffling my hair.','Let me straighten my hair for a moment, please.','Teasing me again? All right, a little longer.'],
      feed:['Thank you. I’ll enjoy this rice.','You remembered my rice. Let’s rest a moment.','A bowl from you always feels especially comforting.'],
      meal:['That was lovely. Thank you for looking after me.','All satisfied. Let me help keep you company now.','Thank you. I treasure these small moments.'],
      success:['Finished. Well done.','That went smoothly. On to the next, together.','Another task done. We’re getting to know each other well.']
    }
  }
};
export function companionDictionaries() {
  const dictionaries = {};
  for (const [language,forms] of Object.entries(dialogue)) {
    dictionaries[language] = {};
    for (const [form,events] of Object.entries(forms)) {
      for (const [event,lines] of Object.entries(events)) {
        lines.forEach((line,level)=>{dictionaries[language][`reply_${form}_${event}_${level}`]=line;});
      }
    }
  }
  return dictionaries;
}
