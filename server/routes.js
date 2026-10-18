const r = require('express').Router(), jwt = require('jsonwebtoken');
const { State, Place } = require('./models');
const wrap = f => (q, s, n) => f(q, s, n).catch(n);
const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const auth = (q, s, n) => {
  try { jwt.verify((q.headers.authorization || '').replace('Bearer ', ''), process.env.JWT_SECRET); n(); }
  catch { s.status(401).json({ error: 'Unauthorized' }); }
};

r.post('/auth/login', (q, s) => {
  const { username, password } = q.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS)
    return s.json({ token: jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' }) });
  s.status(401).json({ error: 'Invalid credentials' });
});

// Public
r.get('/states', wrap(async (q, s) => s.json(await State.find().sort('name'))));

r.get('/states/:slug', wrap(async (q, s) => {
  const state = await State.findOne({ slug: q.params.slug });
  if (!state) return s.status(404).json({ error: 'State not found' });
  s.json({ state, places: await Place.find({ state: state._id }).sort('name') });
}));

r.get('/places', wrap(async (q, s) => {
  const { q: text, state, city, category, page = 1 } = q.query, f = {};
  if (state) { const st = await State.findOne({ slug: state }); f.state = st ? st._id : null; }
  if (city) f.city = new RegExp(`^${esc(city)}$`, 'i');
  if (category) f.category = category;
  if (text) { const rx = new RegExp(esc(text), 'i'); f.$or = [{ name: rx }, { city: rx }]; }
  const limit = 24;
  const [items, total] = await Promise.all([
    Place.find(f).populate('state', 'name slug').sort('name').skip((page - 1) * limit).limit(limit),
    Place.countDocuments(f),
  ]);
  s.json({ items, total, pages: Math.ceil(total / limit) });
}));

r.get('/cities', wrap(async (q, s) => {
  const f = {};
  if (q.query.state) { const st = await State.findOne({ slug: q.query.state }); f.state = st ? st._id : null; }
  s.json((await Place.distinct('city', f)).sort());
}));

r.get('/places/:slug', wrap(async (q, s) => {
  const p = await Place.findOne({ slug: q.params.slug }).populate('state', 'name slug');
  p ? s.json(p) : s.status(404).json({ error: 'Place not found' });
}));

// Admin
r.post('/states', auth, wrap(async (q, s) => s.status(201).json(await State.create(q.body))));
r.post('/places', auth, wrap(async (q, s) => s.status(201).json(await Place.create(q.body))));
r.put('/places/:id', auth, wrap(async (q, s) => s.json(await Place.findByIdAndUpdate(q.params.id, q.body, { new: true, runValidators: true }))));
r.delete('/places/:id', auth, wrap(async (q, s) => { await Place.findByIdAndDelete(q.params.id); s.json({ ok: true }); }));

r.use((e, q, s, n) => s.status(400).json({ error: e.message }));
module.exports = r;
