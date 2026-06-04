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

export const skills: Skill[] = [
  // Backend
  { id: 'python', displayOrder: 1, name: 'Python', category: 'backend' },
  { id: 'django', displayOrder: 2, name: 'Django', category: 'backend' },
  {
    id: 'django-rest-framework',
    displayOrder: 3,
    name: 'Django REST Framework',
    category: 'backend',
  },
  { id: 'rest-apis', displayOrder: 4, name: 'REST APIs', category: 'backend' },
  {
    id: 'authentication-permissions',
    displayOrder: 5,
    name: 'Authentication & Permissions',
    category: 'backend',
  },

  // Databases
  {
    id: 'postgresql',
    displayOrder: 6,
    name: 'PostgreSQL',
    category: 'database',
  },
  { id: 'sql', displayOrder: 7, name: 'SQL', category: 'database' },
  {
    id: 'database-design',
    displayOrder: 8,
    name: 'Database Design',
    category: 'database',
  },

  // Frontend
  { id: 'react', displayOrder: 9, name: 'React', category: 'frontend' },
  {
    id: 'typescript',
    displayOrder: 10,
    name: 'TypeScript',
    category: 'frontend',
  },
  {
    id: 'tailwind-css',
    displayOrder: 11,
    name: 'Tailwind CSS',
    category: 'frontend',
  },
  { id: 'vite', displayOrder: 12, name: 'Vite', category: 'frontend' },

  // Infrastructure
  {
    id: 'docker',
    displayOrder: 13,
    name: 'Docker',
    category: 'infrastructure',
  },
  {
    id: 'linux',
    displayOrder: 14,
    name: 'Linux',
    category: 'infrastructure',
  },
  {
    id: 'bash',
    displayOrder: 15,
    name: 'Bash',
    category: 'infrastructure',
  },
  {
    id: 'git',
    displayOrder: 16,
    name: 'Git',
    category: 'infrastructure',
  },
  {
    id: 'ci-cd',
    displayOrder: 17,
    name: 'CI/CD',
    category: 'infrastructure',
  },
  {
    id: 'tailscale',
    displayOrder: 18,
    name: 'Tailscale',
    category: 'infrastructure',
  },

  // Hardware & Automation
  {
    id: 'raspberry-pi',
    displayOrder: 19,
    name: 'Raspberry Pi',
    category: 'automation',
  },
  {
    id: 'access-control-systems',
    displayOrder: 20,
    name: 'Access Control Systems',
    category: 'automation',
  },
  {
    id: 'hardware-integration',
    displayOrder: 21,
    name: 'Hardware Integration',
    category: 'automation',
  },
  {
    id: 'process-automation',
    displayOrder: 22,
    name: 'Process Automation',
    category: 'automation',
  },
  {
    id: 'pytest',
    displayOrder: 23,
    name: 'Pytest',
    category: 'automation',
  },
  {
    id: 'selenium',
    displayOrder: 24,
    name: 'Selenium',
    category: 'automation',
  },
  {
    id: 'test-automation',
    displayOrder: 25,
    name: 'Test Automation',
    category: 'automation',
  },
  { id: 'qa', displayOrder: 26, name: 'QA', category: 'automation' },

  // Product & Operations
  {
    id: 'product-development',
    displayOrder: 27,
    name: 'Product Development',
    category: 'product',
  },
  { id: 'saas', displayOrder: 28, name: 'SaaS', category: 'product' },
  {
    id: 'fitness-management',
    displayOrder: 29,
    name: 'Fitness Management',
    category: 'product',
  },
  {
    id: 'fitness-operations',
    displayOrder: 30,
    name: 'Fitness Operations',
    category: 'product',
  },
  {
    id: 'business-operations',
    displayOrder: 31,
    name: 'Business Operations',
    category: 'product',
  },
  {
    id: 'workflow-optimization',
    displayOrder: 32,
    name: 'Workflow Optimization',
    category: 'product',
  },
  {
    id: 'workflow-automation',
    displayOrder: 33,
    name: 'Workflow Automation',
    category: 'product',
  },
  {
    id: 'business-systems',
    displayOrder: 34,
    name: 'Business Systems',
    category: 'product',
  },
  {
    id: 'operations',
    displayOrder: 35,
    name: 'Operations',
    category: 'product',
  },
  {
    id: 'process-design',
    displayOrder: 36,
    name: 'Process Design',
    category: 'product',
  },
  {
    id: 'team-training',
    displayOrder: 37,
    name: 'Team Training',
    category: 'product',
  },
  {
    id: 'sales-systems',
    displayOrder: 38,
    name: 'Sales Systems',
    category: 'product',
  },
  {
    id: 'business-automation',
    displayOrder: 39,
    name: 'Business Automation',
    category: 'product',
  },
  {
    id: 'workflow-design',
    displayOrder: 40,
    name: 'Workflow Design',
    category: 'product',
  },
  {
    id: 'customer-support',
    displayOrder: 41,
    name: 'Customer Support',
    category: 'product',
  },
  {
    id: 'software-adoption',
    displayOrder: 42,
    name: 'Software Adoption',
    category: 'product',
  },
  { id: 'ai', displayOrder: 43, name: 'AI', category: 'product' },
  {
    id: 'task-planning',
    displayOrder: 44,
    name: 'Task Planning',
    category: 'product',
  },
  {
    id: 'productivity',
    displayOrder: 45,
    name: 'Productivity',
    category: 'product',
  },
];

const skillById = new Map(skills.map((skill) => [skill.id, skill]));

function getSkills(skillIds: string[]): Skill[] {
  return skillIds.map((skillId) => {
    const skill = skillById.get(skillId);

    if (!skill) {
      throw new Error(`Missing skill: ${skillId}`);
    }

    return skill;
  });
}

export const projects: Project[] = [
  {
    id: 'lymbo',
    displayOrder: 1,
    title: 'Lymbo',
    description: `Co-founded and developed a gym management and access control platform designed to streamline daily operations for fitness centers.

Led the architecture and development of core features including member onboarding, memberships, payments, attendance tracking, sales management, and role-based administration. Built using React, TypeScript, Django, PostgreSQL, Docker, and REST APIs.

Designed an integrated access control solution using Raspberry Pi devices, enabling real-time membership validation, automated door access, and hardware-software communication.

Worked across the full product lifecycle, from business analysis and database design to frontend development, backend APIs, infrastructure, deployment, and hardware integration.

Currently preparing the platform for production deployment in real-world gym environments.`,
    landing: 'https://lymbo.com',
    featured: true,
    skills: getSkills([
      'fitness-management',
      'saas',
      'product-development',
      'operations',
      'process-automation',
    ]),
  },
  {
    id: 'ia-todos',
    displayOrder: 2,
    title: 'ia-todos',
    description: `A task planning app where users add a task and AI generates
clear, actionable steps to complete it.`,
    github: 'https://github.com/AlejoAssain/ia-todos',
    featured: false,
    skills: getSkills(['ai', 'task-planning', 'productivity']),
  },
];

export const experiences: Experience[] = [
  {
    id: 'lymbo',
    displayOrder: 1,
    role: 'Co-Founder & Product Developer',
    company: 'Lymbo',
    period: 'March 2025 - Present',
    location: 'Córdoba, Argentina',
    description: `Co-created a fitness center management platform with Mauricio Molina Picco,
focused on turning real operational pain points from gym businesses into
software workflows.

The platform is designed to support member management, sales operations,
staff coordination, and administrative processes from a single system.
Lymbo is nearly production-ready and planned to be adopted by WALD Gym Zone
and Fox Ladies Gym as early real-world implementations.`,
    skills: getSkills([
      'product-development',
      'saas',
      'fitness-operations',
      'workflow-automation',
      'business-systems',
    ]),
  },
  {
    id: 'vates',
    displayOrder: 2,
    role: 'QA Automation Engineer',
    company: 'Vates',
    period: 'Jun 2023 - Feb 2024',
    location: 'Córdoba Capital, Argentina',
    description: `Worked on the transition from manual test cases to automated test suites,
turning repetitive QA workflows into reliable automated checks.

Built and maintained end-to-end tests, improved regression coverage, and
collaborated with the team to make testing faster, clearer, and easier to
repeat.`,
    skills: getSkills(['python', 'pytest', 'selenium', 'test-automation', 'qa']),
  },
  {
    id: 'wald-gym-zone',
    displayOrder: 3,
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
    skills: getSkills([
      'operations',
      'process-design',
      'team-training',
      'sales-systems',
      'business-automation',
    ]),
  },
  {
    id: 'fox-ladies-gym',
    displayOrder: 4,
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
    skills: getSkills([
      'operations',
      'workflow-design',
      'customer-support',
      'team-training',
      'software-adoption',
    ]),
  },
];
export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/AlejoAssain', icon: 'github' },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/alejoassain/',
    icon: 'linkedin',
  },
  { name: 'X', url: 'https://x.com/AlejoAssain', icon: 'twitter' },
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
