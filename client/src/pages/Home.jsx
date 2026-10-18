import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PlaceCard from '../components/PlaceCard.jsx';

const CATS = ['Heritage', 'Nature', 'Adventure', 'Religious'];

export default function Home() {
  const [states, setStates] = useState([]), [cities, setCities] = useState([]);
  const [f, setF] = useState({ q: '', state: '', city: '', category: '' });
  const [res, setRes] = useState({ items: [], total: 0 });
  const set = k => e => setF(o => ({ ...o, [k]: e.target.value, ...(k === 'state' && { city: '' }) }));

  useEffect(() => { api('/states').then(setStates); }, []);
  useEffect(() => { api('/cities?state=' + f.state).then(setCities); }, [f.state]);
  useEffect(() => {
    const t = setTimeout(() => api('/places?' + new URLSearchParams(f)).then(setRes).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [f]);

  return (<>
    <section className="hero"><h1>Discover Incredible India</h1><p>State-wise and city-wise tourist places, in one place.</p></section>
    <div className="filters">
      <input placeholder="Search place or city…" value={f.q} onChange={set('q')} />
      <select value={f.state} onChange={set('state')}><option value="">All states</option>
        {states.map(s => <option key={s._id} value={s.slug}>{s.name}</option>)}</select>
      <select value={f.city} onChange={set('city')}><option value="">All cities</option>
        {cities.map(c => <option key={c}>{c}</option>)}</select>
      <select value={f.category} onChange={set('category')}><option value="">All categories</option>
        {CATS.map(c => <option key={c}>{c}</option>)}</select>
    </div>
    <h2>Browse by state</h2>
    <div className="chips">{states.map(s => <Link key={s._id} to={`/state/${s.slug}`}>{s.name}</Link>)}</div>
    <h2>{res.total} destination{res.total === 1 ? '' : 's'}</h2>
    <div className="grid">{res.items.map(p => <PlaceCard key={p._id} p={p} />)}</div>
  </>);
}
