/** Landing hero — original copy preserved, restyled with Liquid Glass chips/panels. */
export default function Hero() {
  return (
    <section id="home">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />

      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <p className="hero-label">Full Stack Developer</p>

            <h1 className="hero-headline">
              Turning <em>Ideas</em> Into Real Web Experiences
            </h1>

            <p className="hero-sub">
              Hi, I'm Abdelrahman Khaled — a Full Stack Developer who transforms ideas into
              modern, fast, and interactive web experiences.
            </p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View My Work
              </a>
              <a href="#contact" className="btn btn-ghost">
                Contact Me
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="/me1.png" alt="Abdelrahman Khaled — thinking" loading="eager" />
            </div>

            <div className="hero-frame" aria-hidden="true" />

            <div className="hero-chip hero-chip-1">
              <span>3+</span>
              years of craft
            </div>
            <div className="hero-chip hero-chip-2">
              <span>✦</span>
              available for work
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-hint-line" />
        scroll
      </div>
    </section>
  )
}
