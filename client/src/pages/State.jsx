import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import PlaceCard from '../components/PlaceCard.jsx';

export default function State() {
  const { slug } = useParams();
  const [d, setD] = useState(null), [err, setErr] = useState(''), [cat, setCat] = useState('');
  useEffect(() => { api('/states/' + slug).then(setD).catch(e => setErr(e.message)); }, [slug]);
  if (err) return <p>{err}</p>;
  if (!d) return <p>Loading…</p>;
  const places = d.places.map(p => ({ ...p, state: d.state })).filter(p => !cat || p.category === cat);
  return (<>
    <h1>{d.state.name}</h1>
    <div className="chips">{['', 'Heritage', 'Nature', 'Adventure', 'Religious'].map(c =>
      <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c || 'All'}</button>)}</div>
    <div className="grid">{places.map(p => <PlaceCard key={p._id} p={p} />)}</div>
    {!places.length && <p>No destinations yet.</p>}
  </>);
}
