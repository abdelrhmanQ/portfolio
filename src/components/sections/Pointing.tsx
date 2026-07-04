import Reveal from '@/components/ui/reveal'

/** Transitional "follow the direction" section between the hero and the work. */
export default function Pointing() {
  return (
    <section id="pointing">
      <div className="blob blob-3" aria-hidden="true" />

      <div className="container">
        <div className="pointing-grid">
          <Reveal className="pointing-visual">
            <div className="pointing-img-frame">
              <img
                src="/me2.png"
                alt="Abdelrahman Khaled — pointing toward work"
                loading="lazy"
              />
            </div>
            <div className="glow-trail" aria-hidden="true" />
          </Reveal>

          <Reveal className="pointing-text" delay={130}>
            <p className="section-eyebrow">Follow the direction</p>

            <h2 className="pointing-headline">
              Scroll Down
              <br />
              <em>To see</em>{' '}…
              <br />
              that's where my work lives.
            </h2>

            <p className="pointing-sub">
              Every idea starts with stillness. Then comes direction. Below is where the thinking
              becomes real — refined, functional, and alive.
            </p>

            <a href="#projects" className="arrow-link">
              <span className="arrow-link-line" />
              See the work
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
