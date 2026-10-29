import type { LocalizedText } from '@/i18n/localize';

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

  /** Shown in the skills section. Hidden skills still appear in projects and experiences. */
  showInSkills?: boolean;

  /** Icon file name in public/skill-icons/, without extension. */
  icon?: string;
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

/**
 * Stores the given text fields once per language. Optional fields stay optional.
 */
type WithLocalized<T, K extends keyof T> = Omit<T, K> & {
  [P in keyof Pick<T, K>]: undefined extends T[P]
    ? LocalizedText | undefined
    : LocalizedText;
};

/** Skill with every language, as loaded from Supabase and edited in admin. */
export type SkillContent = WithLocalized<Skill, 'name'>;

/** Project with every language, as loaded from Supabase and edited in admin. */
export type ProjectContent = WithLocalized<
  Omit<Project, 'skills'>,
  'title' | 'description'
> & { skills: SkillContent[] };

/** Experience with every language, as loaded from Supabase and edited in admin. */
export type ExperienceContent = WithLocalized<
  Omit<Experience, 'skills'>,
  'role' | 'period' | 'location' | 'description'
> & { skills: SkillContent[] };

/** Personal info with every language, as loaded from Supabase and edited in admin. */
export type PersonalInfoContent = WithLocalized<
  PersonalInfo,
  'title' | 'tagline' | 'bio' | 'location' | 'status'
>;

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
 * Translatable text column. Plain text before the i18n migration, jsonb
 * keyed by language after it.
 */
type LocalizableColumn = LocalizedText | string;

/**
 * Skill row returned by Supabase.
 */
export type SkillRow = {
  id: string;
  display_order: number;
  name: LocalizableColumn;
  category: Skill['category'];
  show_in_skills: boolean;
  icon: Nullable<string>;
};

/**
 * Project row returned by Supabase.
 */
export type ProjectRow = {
  id: string;
  display_order: number;
  title: LocalizableColumn;
  description: LocalizableColumn;
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
  role: LocalizableColumn;
  company: string;
  company_url: Nullable<string>;
  period: LocalizableColumn;
  location: Nullable<LocalizableColumn>;
  description: LocalizableColumn;
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
  title: LocalizableColumn;
  tagline: LocalizableColumn;
  bio: LocalizableColumn;
  email: string;
  location: LocalizableColumn;
  status: LocalizableColumn;
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
