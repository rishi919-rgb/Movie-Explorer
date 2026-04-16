import { NavLink } from 'react-router-dom'

function Navbar({ summary }) {
  return (
    <header className="site-header">
      <div className="brand-block">
        <p className="eyebrow">Streaming-style discovery</p>
        <NavLink to="/" className="brand-mark">
          Movie Explorer X
        </NavLink>
      </div>

      <nav className="site-nav">
        <NavLink to="/">Discover</NavLink>
        <NavLink to="/favorites">Your Vault</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      <div className="header-stats">
        <span>{summary.favorites} favorites</span>
        <span>{summary.watchlist} watchlist</span>
        <span>{summary.watched} watched</span>
      </div>
    </header>
  )
}

export default Navbar
