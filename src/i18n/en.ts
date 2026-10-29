import type { Skill } from '@/types';

export const en = {
  meta: {
    title: 'Alejo Assain — Software Developer',
    description:
      'Alejo Assain, software developer in Córdoba, Argentina. Co-founder of Lymbo, a gym management and access control platform built from running real fitness businesses.',
  },
  language: {
    label: 'Language',
  },
  header: {
    skipToContent: 'Skip to content',
    sayHello: 'Say hello',
  },
  nav: {
    label: 'Sections',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
  },
  hero: {
    scroll: 'Scroll',
    scrollLabel: 'Scroll to about section',
  },
  about: {
    heading: 'About',
    quickInfo: 'Quick Info',
    location: 'Location',
    email: 'Email',
    status: 'Status',
  },
  experience: {
    heading: 'Experience',
  },
  projects: {
    heading: 'Projects',
    featured: 'Featured Project',
    other: 'Other Notable Projects',
    links: {
      github: 'GitHub',
      demo: 'Demo',
      landing: 'Landing',
    },
    viewLink: (title: string, link: string) => `View ${title} ${link}`,
  },
  skills: {
    heading: 'Skills',
    categories: {
      backend: 'Backend',
      database: 'Databases',
      frontend: 'Frontend',
      infrastructure: 'Infrastructure',
      automation: 'Hardware & Automation',
      product: 'Product & Operations',
    } satisfies Record<Skill['category'], string>,
  },
  contact: {
    heading: 'Contact',
    intro:
      'Got an idea, a project, or a problem worth solving? Leave me a message and I will get back to you.',
    trigger: 'Leave me a message',
    title: 'Leave me a message',
    description:
      'Tell me what you are building, fixing, or trying to make less annoying.',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    message: 'Message',
    messagePlaceholder: "What's on your mind?",
    send: 'Send message',
    sending: 'Sending...',
    sent: 'Thanks! I will contact you soon.',
    sendFailed: 'Message could not be sent.',
    // Keyed by the contact function's error codes; unknown codes use sendFailed.
    errors: {
      invalid_name: 'Check your name and try again.',
      invalid_email: 'Check your email and try again.',
      invalid_message: 'Check your message and try again.',
      missing_bot_check: 'Complete the bot check before sending.',
      bot_check_failed: 'The bot check failed. Please try again.',
      bot_check_unavailable:
        'The bot check is temporarily unavailable. Please try again.',
      network: 'Message could not be sent. Check your connection.',
    },
    botCheckRequired: 'Complete the bot check before sending.',
    botCheckNotConfigured: 'The bot check is not configured.',
    botCheckExpired: 'The bot check expired. Please try again.',
    botCheckFailedToLoad: 'The bot check failed to load.',
  },
};

export type Dictionary = typeof en;
