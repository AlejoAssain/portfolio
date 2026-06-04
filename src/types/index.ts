export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  link?: string
  github?: string
  image?: string
  featured?: boolean
}

export interface Experience {
  id: string
  role: string
  company: string
  companyUrl?: string
  period: string
  location?: string
  description: string
  technologies: string[]
}

export interface Skill {
  name: string
  category:
    | 'backend'
    | 'database'
    | 'frontend'
    | 'infrastructure'
    | 'automation'
    | 'product'
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface NavItem {
  label: string
  href: string
}

export interface PersonalInfo {
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  location: string
  status: string
}
