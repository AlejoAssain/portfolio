/**
 * Project shown in the portfolio.
 */
export interface Project {
  /** Unique project id. */
  id: string;

  /** Display position. */
  displayOrder: number;

  /** Project display name. */
  title: string;

  /** Card description. */
  description: string;

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

  /** Related skills shown in the project card. */
  skills: Skill[];
}

/**
 * Work or business experience shown in the timeline.
 */
export interface Experience {
  /** Unique experience id. */
  id: string;

  /** Display position. */
  displayOrder: number;

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

  /** Related skills shown in the timeline card. */
  skills: Skill[];
}

/**
 * Skill shown in the skills section.
 */
export interface Skill {
  /** Unique skill id. */
  id: string;

  /** Display position. */
  displayOrder: number;

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
 *
 * Static UI config, not loaded from Supabase.
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
 *
 * Static UI config, not loaded from Supabase.
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

export type SectionVisibility = {
  about: boolean;
  experience: boolean;
  projects: boolean;
  skills: boolean;
  contact: boolean;
};

/**
 * Message submitted from the contact form.
 */
export interface ContactMessage {
  /** Unique message id. */
  id: string;

  /** Sender name. */
  name: string;

  /** Sender email. */
  email: string;

  /** Message body. */
  message: string;

  /** Creation timestamp. */
  createdAt: string;
}

/**
 * Contact form payload sent to the contact Edge Function.
 */
export type ContactMessageInput = Pick<
  ContactMessage,
  'name' | 'email' | 'message'
> & {
  /** Cloudflare Turnstile token generated in the browser. */
  turnstileToken?: string;

  /** Hidden honeypot field. Real users should leave it empty. */
  website?: string;
};

type Nullable<T> = T | null;

/**
 * Skill row returned by Supabase.
 */
export type SkillRow = {
  id: string;
  display_order: number;
  name: string;
  category: Skill['category'];
};

/**
 * Project row returned by Supabase.
 */
export type ProjectRow = {
  id: string;
  display_order: number;
  title: string;
  description: string;
  github: Nullable<string>;
  demo: Nullable<string>;
  landing: Nullable<string>;
  image: Nullable<string>;
  featured: boolean;
};

/**
 * Project-to-skill join row returned by Supabase.
 */
export type ProjectSkillRow = {
  display_order: number;
  skills: SkillRow;
};

/**
 * Project row with nested skills returned by Supabase.
 */
export type ProjectWithSkillsRow = ProjectRow & {
  project_skills?: ProjectSkillRow[];
};

/**
 * Experience row returned by Supabase.
 */
export type ExperienceRow = {
  id: string;
  display_order: number;
  role: string;
  company: string;
  company_url: Nullable<string>;
  period: string;
  location: Nullable<string>;
  description: string;
};

/**
 * Experience-to-skill join row returned by Supabase.
 */
export type ExperienceSkillRow = {
  display_order: number;
  skills: SkillRow;
};

/**
 * Experience row with nested skills returned by Supabase.
 */
export type ExperienceWithSkillsRow = ExperienceRow & {
  experience_skills?: ExperienceSkillRow[];
};

/**
 * Personal info row returned by Supabase.
 */
export type PersonalInfoRow = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  status: string;
};

/**
 * Contact message row returned by Supabase.
 */
export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
