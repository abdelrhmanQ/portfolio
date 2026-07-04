import Reveal from '@/components/ui/reveal'

/** About section — decorative code block + bio. Copy preserved from the original site. */
export default function About() {
  return (
    <section id="about">
      <div className="blob blob-6" aria-hidden="true" />
      <div className="container">
        <div className="about-grid">
          <Reveal className="about-left">
            <div className="about-code-block">
              <div className="code-comment">{'// developer.profile'}</div>
              <br />
              <div>
                <span className="code-key">const</span>
                <span className="code-plain"> developer </span>
                <span className="code-key">= </span>
                <span className="code-plain">{'{'}</span>
              </div>

              <div className="code-indent">
                <span className="code-key">name</span>:
                <span className="code-str"> "Abdelrahman Khaled"</span>,
              </div>

              <div className="code-indent">
                <span className="code-key">role</span>:
                <span className="code-str"> "Full Stack Developer"</span>,
              </div>

              <div className="code-indent">
                <span className="code-key">focus</span>: [
                <div className="code-indent">
                  <span className="code-str">"Front-End Development"</span>,<br />
                  <span className="code-str">"Back-End APIs"</span>,<br />
                  <span className="code-str">"Database Architecture"</span>
                </div>
                ],
              </div>

              <div className="code-indent">
                <span className="code-key">tech</span>: [
                <div className="code-indent">
                  <span className="code-str">"NextJS"</span>,<br />
                  <span className="code-str">"Node.js"</span>,<br />
                  <span className="code-str">"MongoDB"</span>
                </div>
                ],
              </div>

              <div className="code-indent">
                <span className="code-key">available</span>:
                <span className="code-num"> true</span>,
              </div>

              <div className="code-indent">
                <span className="code-key">passion</span>:
                <span className="code-str"> "building complete web applications"</span>
              </div>

              <div>{'}'}</div>
            </div>
          </Reveal>

          <Reveal className="about-right" delay={130}>
            <p className="section-eyebrow">About me</p>

            <h2 className="about-headline">
              A developer who <em>cares</em> about the craft.
            </h2>

            <p className="about-body">
              I'm Abdelrahman Khaled, a Full Stack Developer focused on building complete web
              applications from concept to deployment. I enjoy turning ideas into scalable,
              efficient, and user-friendly digital products.
              <br />
              <br />
              My work covers both front-end and back-end development — designing clean interfaces,
              building powerful server logic, and connecting everything with reliable databases to
              deliver smooth and performant web experiences.
            </p>

            <ul className="skills-list">
              <li className="skill-item">
                <span className="skill-dot" />
                Front-End Development (HTML, CSS, JavaScript, React)
              </li>
              <li className="skill-item">
                <span className="skill-dot" />
                Back-End Development (Node.js, APIs, Server Logic, NextJS)
              </li>
              <li className="skill-item">
                <span className="skill-dot" />
                Database Design &amp; Full Stack Application Architecture
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
