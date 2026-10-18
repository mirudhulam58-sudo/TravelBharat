import { useEffect, useState } from 'react';
import api from '../api';

const blank = { name: '', state: '', city: '', category: 'Heritage', description: '', history: '', bestTime: '', entryFee: '', timings: '', mapLink: '', images: '', nearby: '' };

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const [cred, setCred] = useState({ username: '', password: '' });
  const [states, setStates] = useState([]), [items, setItems] = useState([]);
  const [form, setForm] = useState(blank), [msg, setMsg] = useState('');
  const load = () => { api('/states').then(setStates); api('/places').then(r => setItems(r.items)); };
  useEffect(() => { if (authed) load(); }, [authed]);

  const login = async e => {
    e.preventDefault();
    try { const { token } = await api('/auth/login', { method: 'POST', body: JSON.stringify(cred) }); localStorage.setItem('token', token); setAuthed(true); setMsg(''); }
    catch (er) { setMsg(er.message); }
  };
  const list = s => s.split(',').map(x => x.trim()).filter(Boolean);
  const save = async e => {
    e.preventDefault();
    try {
      await api('/places', { method: 'POST', body: JSON.stringify({ ...form, images: list(form.images), nearby: list(form.nearby) }) });
      setForm(blank); setMsg('Saved ✔'); load();
    } catch (er) { setMsg(er.message); if (er.message === 'Unauthorized') { localStorage.removeItem('token'); setAuthed(false); } }
  };
  const del = async id => { if (confirm('Delete this place?')) { await api('/places/' + id, { method: 'DELETE' }); load(); } };
  const f = k => ({ value: form[k], onChange: e => setForm({ ...form, [k]: e.target.value }) });

  if (!authed) return (
    <form onSubmit={login} className="form"><h1>Admin login</h1>
      <input placeholder="Username" value={cred.username} onChange={e => setCred({ ...cred, username: e.target.value })} />
      <input type="password" placeholder="Password" value={cred.password} onChange={e => setCred({ ...cred, password: e.target.value })} />
      <button>Login</button><p>{msg}</p></form>);

  return (<>
    <h1>Admin dashboard <button onClick={() => { localStorage.removeItem('token'); setAuthed(false); }}>Logout</button></h1>
    <form onSubmit={save} className="form">
      <h2>Add destination</h2>
      <input required placeholder="Place name" {...f('name')} />
      <select required {...f('state')}><option value="">Select state</option>{states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select>
      <input required placeholder="City" {...f('city')} />
      <select {...f('category')}>{['Heritage', 'Nature', 'Adventure', 'Religious'].map(c => <option key={c}>{c}</option>)}</select>
      <textarea placeholder="Description" {...f('description')} />
      <textarea placeholder="Historical significance" {...f('history')} />
      <input placeholder="Best time to visit" {...f('bestTime')} />
      <input placeholder="Entry fee" {...f('entryFee')} />
      <input placeholder="Timings" {...f('timings')} />
      <input placeholder="Google Maps link" {...f('mapLink')} />
      <input placeholder="Image URLs (comma separated)" {...f('images')} />
      <input placeholder="Nearby attractions (comma separated)" {...f('nearby')} />
      <button>Save</button><p>{msg}</p>
    </form>
    <h2>All destinations</h2>
    <table><tbody>{items.map(p => <tr key={p._id}><td>{p.name}</td><td>{p.city}, {p.state?.name}</td><td>{p.category}</td><td><button onClick={() => del(p._id)}>Delete</button></td></tr>)}</tbody></table>
  </>);
}
