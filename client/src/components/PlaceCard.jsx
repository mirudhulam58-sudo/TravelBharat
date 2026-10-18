import { Link } from 'react-router-dom';
export default function PlaceCard({ p }) {
  return (
    <Link to={`/place/${p.slug}`} className="card">
      <img src={p.images?.[0]} alt={p.name} loading="lazy" />
      <div><span className="tag">{p.category}</span><h3>{p.name}</h3>
        <small>{p.city}{p.state?.name ? `, ${p.state.name}` : ''}</small></div>
    </Link>
  );
}
