import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import State from './pages/State.jsx';
import Place from './pages/Place.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (<>
    <header><Link to="/" className="logo">Travel<b>Bharat</b></Link><Link to="/admin">Admin</Link></header>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/state/:slug" element={<State />} />
        <Route path="/place/:slug" element={<Place />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </main>
    <footer>© TravelBharat – a digital travel encyclopedia of India</footer>
  </>);
}
