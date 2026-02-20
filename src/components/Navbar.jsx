import { Link } from 'react-router-dom'

function Navbar({ favoriteCount }) {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites ({favoriteCount})</Link>
      <Link to="/about">About</Link>
    </nav>
  )
}

export default Navbar
