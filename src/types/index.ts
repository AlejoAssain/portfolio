/**
 * Project shown in the portfolio.
 */
export interface Project {
  /** Unique project id. */
  id: string;

  /** Project display name. */
  title: string;

  /** Card description. */
  description: string;

  /** Tech, categories, or concepts. */
  tags: string[];

  /** Optional repository link. */
  github?: string;

  /** Optional live demo link. */
  demo?: string;

  /** Optional landing page link. */
  landing?: string;

  /** Optional project image. */
  image?: string;

  /** Marks the project as featured or as other notable projects. */
  featured?: boolean;
}

/**
 * Work or business experience shown in the timeline.
 */
export interface Experience {
  /** Unique experience id. */
  id: string;

  /** Role or position name. */
  role: string;

  /** Company or project name. */
  company: string;

  /** Optional company website link. */
  companyUrl?: string;

  /** Time range shown in the UI. */
  period: string;

  /** Optional work location. */
  location?: string;

  /** Experience summary. */
  description: string;

  /** Relevant tools, skills, or domains. */
  technologies: string[];
}

/**
 * Skill shown in the skills section.
 */
export interface Skill {
  /** Skill display name. */
  name: string;

  /** Skill group used for filtering or layout. */
  category:
    | 'backend'
    | 'database'
    | 'frontend'
    | 'infrastructure'
    | 'automation'
    | 'product';
}

/**
 * External profile or contact link.
 */
export interface SocialLink {
  /** Link display name. */
  name: string;

  /** Target URL. */
  url: string;

  /** Icon key used by the UI. */
  icon: string;
}

/**
 * Header navigation item.
 */
export interface NavItem {
  /** Navigation label. */
  label: string;

  /** Section anchor or URL. */
  href: string;
}

/**
 * Main personal content shown across the portfolio.
 */
export interface PersonalInfo {
  /** Full display name. */
  name: string;

  /** Professional title. */
  title: string;

  /** Short hero tagline. */
  tagline: string;

  /** Personal bio text. */
  bio: string;

  /** Contact email. */
  email: string;

  /** Current location. */
  location: string;

  /** Availability or current status. */
  status: string;
}
