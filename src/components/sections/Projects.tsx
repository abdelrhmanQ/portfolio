import { PROJECTS } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import Reveal from '@/components/ui/reveal'

const CARD_STAGGER_MS = 130

/** Selected work grid — cards are generated from the PROJECTS data array. */
export default function Projects() {
  return (
    <section id="projects">
      <div className="blob blob-4" aria-hidden="true" />
      <div className="blob blob-5" aria-hidden="true" />

      <div className="container">
        <Reveal className="section-header">
          <h2 className="section-title">
            Selected <em>Work</em>
          </h2>
          <p className="section-divider">projects</p>
        </Reveal>

        <div className="projects-grid">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.id} delay={index * CARD_STAGGER_MS}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
