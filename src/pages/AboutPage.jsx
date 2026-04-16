function AboutPage() {
  return (
    <main className="page-shell">
      <section className="about-panel">
        <p className="eyebrow">What changed</p>
        <h1>Movie Explorer became a full discovery and tracking experience.</h1>
        <div className="about-grid">
          <article className="details-panel">
            <h2>Discovery upgrades</h2>
            <p>Search with type, year, and sorting controls.</p>
            <p>Browse curated cinematic collections for fast inspiration.</p>
            <p>Use recent-search chips to jump back into previous sessions instantly.</p>
          </article>
          <article className="details-panel">
            <h2>Personal features</h2>
            <p>Track favorites, watchlist items, and watched status independently.</p>
            <p>Leave personal ratings and notes on detail pages.</p>
            <p>Filter your vault by favorites, ratings, notes, and watch progress.</p>
          </article>
          <article className="details-panel">
            <h2>Visual overhaul</h2>
            <p>A new cinematic interface with stronger hierarchy, richer cards, and a premium feel.</p>
            <p>Responsive layouts now scale more cleanly across desktop and mobile.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
