import { memo } from 'react'
import type { Project } from '@/data/projects'
import { useTilt } from './useTilt'

const MAX_TILT_DEG = 10

interface ProjectCardProps {
  project: Project
}

/**
 * Glass-panel project card with a bounded pointer-tilt effect.
 * Fully data-driven — everything rendered comes from the `project` prop.
 * Memoised: the projects list never changes at runtime, so cards skip re-renders.
 */
function ProjectCardBase({ project }: ProjectCardProps) {
  const tiltRef = useTilt<HTMLElement>({ maxTiltDeg: MAX_TILT_DEG })

  return (
    <article ref={tiltRef} className="project-card">
      <div className="project-card__glow" aria-hidden="true" />
      <div className="project-card__img-wrap">
        <img src={project.image.src} alt={project.image.alt} loading="lazy" />
      </div>
      <div className="project-card__body">
        <p className="project-card__tag">{project.techStack.join(' · ')}</p>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__actions">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

const ProjectCard = memo(ProjectCardBase)
export default ProjectCard
