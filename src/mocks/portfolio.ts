import type {
  Experience,
  NavItem,
  PersonalInfo,
  Project,
  Skill,
  SocialLink,
} from '@/types';

export const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
];

export const projects: Project[] = [
  {
    id: 'lymbo',
    title: 'Lymbo',
    description: `Co-founded and developed a gym management and access control platform designed to streamline daily operations for fitness centers.

Led the architecture and development of core features including member onboarding, memberships, payments, attendance tracking, sales management, and role-based administration. Built using React, TypeScript, Django, PostgreSQL, Docker, and REST APIs.

Designed an integrated access control solution using Raspberry Pi devices, enabling real-time membership validation, automated door access, and hardware-software communication.

Worked across the full product lifecycle, from business analysis and database design to frontend development, backend APIs, infrastructure, deployment, and hardware integration.

Currently preparing the platform for production deployment in real-world gym environments.`,
    tags: [
      'Fitness Management',
      'SaaS',
      'Product Development',
      'Operations',
      'Process Automation',
    ],
    github: 'https://github.com/mauriciomolinapicco/lymbo',
    featured: true,
  },
  {
    id: 'ia-todos',
    title: 'ia-todos',
    description: `A task planning app where users add a task and AI generates
clear, actionable steps to complete it.`,
    tags: ['AI', 'Task Planning', 'Productivity'],
    github: 'https://github.com/AlejoAssain/ia-todos',
    featured: false,
  },
];

export const experiences: Experience[] = [
  {
    id: 'lymbo',
    role: 'Co-Founder & Product Developer',
    company: 'Lymbo',
    companyUrl: 'https://github.com/mauriciomolinapicco/lymbo',
    period: 'March 2025 - Present',
    location: 'Córdoba, Argentina',
    description: `Co-created a fitness center management platform with Mauricio Molina Picco,
focused on turning real operational pain points from gym businesses into
software workflows.

The platform is designed to support member management, sales operations,
staff coordination, and administrative processes from a single system.
Lymbo is nearly production-ready and planned to be adopted by WALD Gym Zone
and Fox Ladies Gym as early real-world implementations.`,
    technologies: [
      'Product Development',
      'SaaS',
      'Fitness Operations',
      'Workflow Automation',
      'Business Systems',
    ],
  },
  {
    id: '1',
    role: 'QA Automation Engineer',
    company: 'Vates',
    period: 'Jun 2023 - Feb 2024',
    location: 'Córdoba Capital, Argentina',
    description: `Worked on the transition from manual test cases to automated test suites,
turning repetitive QA workflows into reliable automated checks.

Built and maintained end-to-end tests, improved regression coverage, and
collaborated with the team to make testing faster, clearer, and easier to
repeat.`,
    technologies: ['Python', 'Pytest', 'Selenium', 'Test Automation', 'QA'],
  },
  {
    id: '2',
    role: 'Co-Founder & Operations Lead',
    company: 'WALD Gym Zone',
    companyUrl: 'https://instagram.com/waldzone',
    period: 'Feb 2024 - Present',
    location: 'Córdoba Capital, Argentina',
    description: `Built the gym brand and operating model from the ground up:
hiring, onboarding, sales processes, customer service workflows, and
internal training.

Led the implementation of third-party management software and trained the
team to use it in daily operations. Currently focused on strategic decisions,
process improvement, and using systems to make the business run with less
friction.`,
    technologies: [
      'Operations',
      'Process Design',
      'Team Training',
      'Sales Systems',
      'Business Automation',
    ],
  },
  {
    id: '3',
    role: 'Co-Founder & Operations Manager',
    company: 'Fox Ladies Gym',
    companyUrl: 'https://instagram.com/foxladiesgym',
    period: 'Mar 2025 - Present',
    location: 'Almafuerte, Córdoba, Argentina',
    description: `Defined and implemented operational processes for hiring, team training,
sales, customer support, and day-to-day gym management.

Connected business workflows with external software tools to keep operations
organized and measurable. Still actively involved in operational decisions
and continuous process improvement.`,
    technologies: [
      'Operations',
      'Workflow Design',
      'Customer Support',
      'Team Training',
      'Software Adoption',
    ],
  },
];

export const skills: Skill[] = [
  // Backend
  { name: 'Python', category: 'backend' },
  { name: 'Django', category: 'backend' },
  { name: 'Django REST Framework', category: 'backend' },
  { name: 'REST APIs', category: 'backend' },
  { name: 'Authentication & Permissions', category: 'backend' },

  // Databases
  { name: 'PostgreSQL', category: 'database' },
  { name: 'SQL', category: 'database' },
  { name: 'Database Design', category: 'database' },

  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Vite', category: 'frontend' },

  // Infrastructure
  { name: 'Docker', category: 'infrastructure' },
  { name: 'Linux', category: 'infrastructure' },
  { name: 'Bash', category: 'infrastructure' },
  { name: 'Git', category: 'infrastructure' },
  { name: 'CI/CD', category: 'infrastructure' },
  { name: 'Tailscale', category: 'infrastructure' },

  // Hardware & Automation
  { name: 'Raspberry Pi', category: 'automation' },
  { name: 'Access Control Systems', category: 'automation' },
  { name: 'Hardware Integration', category: 'automation' },
  { name: 'Process Automation', category: 'automation' },

  // Product & Operations
  { name: 'Product Development', category: 'product' },
  { name: 'Business Operations', category: 'product' },
  { name: 'Workflow Optimization', category: 'product' },
];
export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { name: 'Email', url: 'mailto:alejoassain00@gmail.com', icon: 'mail' },
];

export const personalInfo: PersonalInfo = {
  name: 'Alejo Assain',
  title: 'Software Developer',
  tagline: 'Building real solutions, automating repetitive work',
  bio: `I'm a developer focused on building practical systems for real-world operations.

By combining hands-on business experience with software engineering, I turn
operational challenges into scalable solutions. My work spans backend
development, frontend applications, automation, infrastructure, and hardware
integration.

Currently, I'm co-building Lymbo, a gym management and access control platform
designed from firsthand experience running fitness centers.`,
  email: 'alejoassain00@gmail.com',
  location: 'Córdoba, Argentina',
  status: 'Available for work',
};
