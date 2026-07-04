import Reveal from '@/components/ui/reveal'

interface ContactChannel {
  href: string
  label: string
  value: string
  external: boolean
  icon: React.ReactNode
}

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    href: 'https://github.com/abdelrahmanK10',
    label: 'GitHub',
    value: 'Abdelrahman Khaled',
    external: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: 'mailto:abdrhmanq5005@gmail.com',
    label: 'Email',
    value: 'abdrhmanq5005@gmail.com',
    external: false,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
  },
  {
    href: 'https://wa.me/201024191609',
    label: 'WhatsApp',
    value: '+20 102 419 1609',
    external: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.93c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.12-.59.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.47-.64-.48-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.03 2.81 1.17 3c.14.19 2.03 3.1 4.92 4.34.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z" />
        <path d="M16.04 3C9.94 3 5 7.94 5 14.04c0 1.94.51 3.83 1.49 5.5L5 29l9.72-1.46c1.62.89 3.45 1.36 5.32 1.36 6.1 0 11.04-4.94 11.04-11.04C31.08 7.94 26.14 3 20.04 3h-4z" />
      </svg>
    ),
  },
]

/** Contact section — glass link cards generated from the CONTACT_CHANNELS array. */
export default function Contact() {
  return (
    <section id="contact">
      <div className="blob blob-7" aria-hidden="true" />

      <div className="container">
        <Reveal className="contact-inner">
          <h2 className="contact-headline">
            Let's build something
            <br />
            <em>worth remembering.</em>
          </h2>

          <p className="contact-sub">
            Have an idea, a project, or just want to say hello? I'd love to hear from you.
          </p>

          <div className="contact-links">
            {CONTACT_CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                className="contact-link"
                {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="contact-link-icon">{channel.icon}</span>
                <span className="contact-link-label">{channel.label}</span>
                <span className="contact-link-val">{channel.value}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
