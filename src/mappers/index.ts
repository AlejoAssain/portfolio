import type {
  ContactMessage,
  ContactMessageRow,
  Experience,
  ExperienceWithSkillsRow,
  PersonalInfo,
  PersonalInfoRow,
  Project,
  ProjectWithSkillsRow,
  Skill,
  SkillRow,
} from '@/types';

function optional(value: string | null): string | undefined {
  return value ?? undefined;
}

export function mapSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    displayOrder: row.display_order,
    name: row.name,
    category: row.category,
  };
}

export function mapProject(row: ProjectWithSkillsRow): Project {
  const skills = [...(row.project_skills ?? [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map((projectSkill) => mapSkill(projectSkill.skills));

  return {
    id: row.id,
    displayOrder: row.display_order,
    title: row.title,
    description: row.description,
    github: optional(row.github),
    demo: optional(row.demo),
    landing: optional(row.landing),
    image: optional(row.image),
    featured: row.featured,
    skills,
  };
}

export function mapExperience(row: ExperienceWithSkillsRow): Experience {
  const skills = [...(row.experience_skills ?? [])]
    .sort((a, b) => a.display_order - b.display_order)
    .map((experienceSkill) => mapSkill(experienceSkill.skills));

  return {
    id: row.id,
    displayOrder: row.display_order,
    role: row.role,
    company: row.company,
    companyUrl: optional(row.company_url),
    period: row.period,
    location: optional(row.location),
    description: row.description,
    skills,
  };
}

export function mapPersonalInfo(row: PersonalInfoRow): PersonalInfo {
  return {
    name: row.name,
    title: row.title,
    tagline: row.tagline,
    bio: row.bio,
    email: row.email,
    location: row.location,
    status: row.status,
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
