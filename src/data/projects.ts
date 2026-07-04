/** Shape of a single portfolio project. `<ProjectCard />` renders exactly this. */
export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  image: {
    src: string
    alt: string
  }
  links: {
    label: string
    href: string
  }[]
}

export const PROJECTS: Project[] = [
  {
    id: 'shop-system',
    title: 'Shop System',
    description:
      'A responsive e-commerce website that allows users to browse products, add items to their cart, and securely checkout using a clean and intuitive interface. Technologies: HTML, CSS, JavaScript, Node.js.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    image: { src: '/PROJECT1.png', alt: 'Shop System — e-commerce storefront' },
    links: [{ label: 'Live Demo', href: 'https://ff-alpha-one.vercel.app/' }],
  },
  {
    id: 'online-order-track',
    title: 'Online Order Track',
    description:
      'A responsive dashboard that enables businesses to manage customer orders, track order status, filter data, and generate invoices through a clean and organized interface. Technologies: HTML, CSS, JavaScript.',
    techStack: ['HTML', 'CSS', 'JS', 'Python'],
    image: { src: '/project2.png', alt: 'Online Order Track — orders dashboard' },
    links: [{ label: 'Live Demo', href: 'https://dokan-eight.vercel.app/' }],
  },
  {
    id: 'healthcare-clinic',
    title: 'Responsive Healthcare Clinic Website',
    description:
      'A responsive website for a healthcare clinic, featuring an intuitive design and seamless user experience. Technologies: HTML, CSS, JavaScript, NestJS.',
    techStack: ['HTML', 'CSS', 'JS', 'NestJS'],
    image: { src: '/Project3.png', alt: 'Healthcare clinic website' },
    links: [{ label: 'Live Demo', href: 'https://clinic-for-test.vercel.app/' }],
  },
]
