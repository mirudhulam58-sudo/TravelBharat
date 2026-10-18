import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';

export default function Place() {
  const { slug } = useParams();
  const [p, setP] = useState(null), [err, setErr] = useState(''), [img, setImg] = useState(0);
  useEffect(() => { setImg(0); api('/places/' + slug).then(d => { setP(d); document.title = d.name + ' – TravelBharat'; }).catch(e => setErr(e.message)); }, [slug]);
  if (err) return <p>{err}</p>;
  if (!p) return <p>Loading…</p>;
  const rows = [['Best time to visit', p.bestTime], ['Entry fee', p.entryFee], ['Timings', p.timings]].filter(r => r[1]);
  return (<article>
    <Link to={`/state/${p.state.slug}`}>← {p.state.name}</Link>
    <h1>{p.name}</h1><p><span className="tag">{p.category}</span> {p.city}, {p.state.name}</p>
    {p.images?.length > 0 && <div className="gallery">
      <img className="main" src={p.images[img]} alt={p.name} />
      <div className="thumbs">{p.images.map((u, i) => <img key={i} src={u} alt="" className={i === img ? 'on' : ''} onClick={() => setImg(i)} />)}</div>
    </div>}
    <p>{p.description}</p>
    {p.history && <><h2>History</h2><p>{p.history}</p></>}
    <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    {p.nearby?.length > 0 && <><h2>Nearby attractions</h2><div className="chips">{p.nearby.map(n => <span key={n}>{n}</span>)}</div></>}
    {p.mapLink && <p><a href={p.mapLink} target="_blank" rel="noreferrer">View on map ↗</a></p>}
  </article>);
}
