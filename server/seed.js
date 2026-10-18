require('dotenv').config();
const mongoose = require('mongoose'), { State, Place } = require('./models');
const img = k => `https://picsum.photos/seed/${k}/900/560`; // placeholders: replace with real photos
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([State.deleteMany(), Place.deleteMany()]);
  const st = {};
  for (const [name, type] of [['Uttar Pradesh'], ['Rajasthan'], ['Kerala'], ['Tamil Nadu'], ['Himachal Pradesh'], ['Delhi', 'UT']])
    st[name] = await State.create({ name, type: type || 'State' });
  const P = (name, state, city, category, description, bestTime, extra = {}) =>
    ({ name, state: st[state]._id, city, category, description, bestTime, images: [img(name + 1), img(name + 2), img(name + 3)], ...extra });
  await Place.create([
    P('Taj Mahal', 'Uttar Pradesh', 'Agra', 'Heritage', 'Ivory-white marble mausoleum on the Yamuna, built by Shah Jahan.', 'October to March', { entryFee: 'Check official ASI rates', timings: 'Sunrise to sunset, closed Fridays', nearby: ['Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri'] }),
    P('Agra Fort', 'Uttar Pradesh', 'Agra', 'Heritage', 'Red sandstone Mughal fortress and UNESCO World Heritage Site.', 'October to March', { nearby: ['Taj Mahal'] }),
    P('Amber Fort', 'Rajasthan', 'Jaipur', 'Heritage', 'Hilltop fort-palace known for its mirror work and courtyards.', 'October to February', { nearby: ['Hawa Mahal', 'City Palace'] }),
    P('Munnar Tea Gardens', 'Kerala', 'Munnar', 'Nature', 'Rolling tea estates and misty hills in the Western Ghats.', 'September to March'),
    P('Meenakshi Amman Temple', 'Tamil Nadu', 'Madurai', 'Religious', 'Historic Dravidian temple with towering gopurams.', 'October to March'),
    P('Triund Trek', 'Himachal Pradesh', 'Dharamshala', 'Adventure', 'Popular short trek with views of the Dhauladhar range.', 'March to June, September to November'),
    P('India Gate', 'Delhi', 'New Delhi', 'Heritage', 'War memorial honouring Indian soldiers.', 'October to March'),
  ]);
  console.log('Seeded'); process.exit();
})();
