import type { Lang } from '@/i18n/languages';
import { localize, toLocalized } from '@/i18n/localize';
import type {
  ContactMessage,
  ContactMessageRow,
  Experience,
  ExperienceContent,
  ExperienceWithSkillsRow,
  PersonalInfo,
  PersonalInfoContent,
  PersonalInfoRow,
  Project,
  ProjectContent,
  ProjectWithSkillsRow,
  Skill,
  SkillContent,
  SkillRow,
} from '@/types';

function optional(value: string | null): string | undefined {
  return value ?? undefined;
}

export function mapSkill(row: SkillRow): SkillContent {
  return {
    id: row.id,
    displayOrder: row.display_order,
    name: toLocalized(row.name),
    category: row.category,
    showInSkills: row.show_in_skills,
    icon: optional(row.icon),
  };
}

export function mapProject(row: ProjectWithSkillsRow): ProjectContent {
  const skills = [...(row.project_skills ?? [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map((projectSkill) => mapSkill(projectSkill.skills));

  return {
    id: row.id,
    displayOrder: row.display_order,
    title: toLocalized(row.title),
    description: toLocalized(row.description),
    github: optional(row.github),
    demo: optional(row.demo),
    landing: optional(row.landing),
    image: optional(row.image),
    featured: row.featured,
    skills,
  };
}

export function mapExperience(
  row: ExperienceWithSkillsRow,
): ExperienceContent {
  const skills = [...(row.experience_skills ?? [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map((experienceSkill) => mapSkill(experienceSkill.skills));

  return {
    id: row.id,
    displayOrder: row.display_order,
    role: toLocalized(row.role),
    company: row.company,
    companyUrl: optional(row.company_url),
    period: toLocalized(row.period),
    location: row.location ? toLocalized(row.location) : undefined,
    description: toLocalized(row.description),
    skills,
  };
}

export function mapPersonalInfo(row: PersonalInfoRow): PersonalInfoContent {
  return {
    name: row.name,
    title: toLocalized(row.title),
    tagline: toLocalized(row.tagline),
    bio: toLocalized(row.bio),
    email: row.email,
    location: toLocalized(row.location),
    status: toLocalized(row.status),
  };
}

export function localizeSkill(skill: SkillContent, lang: Lang): Skill {
  return { ...skill, name: localize(skill.name, lang) };
}

export function localizeProject(project: ProjectContent, lang: Lang): Project {
  return {
    ...project,
    title: localize(project.title, lang),
    description: localize(project.description, lang),
    skills: project.skills.map((skill) => localizeSkill(skill, lang)),
  };
}

export function localizeExperience(
  experience: ExperienceContent,
  lang: Lang,
): Experience {
  return {
    ...experience,
    role: localize(experience.role, lang),
    period: localize(experience.period, lang),
    location: experience.location && localize(experience.location, lang),
    description: localize(experience.description, lang),
    skills: experience.skills.map((skill) => localizeSkill(skill, lang)),
  };
}

export function localizePersonalInfo(
  info: PersonalInfoContent,
  lang: Lang,
): PersonalInfo {
  return {
    ...info,
    title: localize(info.title, lang),
    tagline: localize(info.tagline, lang),
    bio: localize(info.bio, lang),
    location: localize(info.location, lang),
    status: localize(info.status, lang),
  };
}

export function mapContactMessage(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  };
}
