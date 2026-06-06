import { supabase } from '@/lib/supabase';
import {
  mapContactMessage,
  mapExperience,
  mapPersonalInfo,
  mapProject,
  mapSkill,
} from '@/mappers';
import type {
  ContactMessage,
  ContactMessageInput,
  ContactMessageRow,
  Experience,
  ExperienceWithSkillsRow,
  PersonalInfo,
  PersonalInfoRow,
  Project,
  ProjectWithSkillsRow,
  Skill,
  SkillRow,
  SectionVisibility,
} from '@/types';

const defaultSectionVisibility: SectionVisibility = {
  about: true,
  experience: true,
  projects: true,
  skills: true,
  contact: true,
};

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapSkill(row as SkillRow));
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      *,
      project_skills (
        display_order,
        skills (*)
      )
    `,
    )
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapProject(row as ProjectWithSkillsRow));
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select(
      `
      *,
      experience_skills (
        display_order,
        skills (*)
      )
    `,
    )
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    mapExperience(row as ExperienceWithSkillsRow),
  );
}

export async function getPersonalInfo(): Promise<PersonalInfo> {
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error) {
    throw error;
  }

  return mapPersonalInfo(data as PersonalInfoRow);
}

export async function createContactMessage(
  input: ContactMessageInput,
): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(input)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapContactMessage(data as ContactMessageRow);
}

export async function getSectionVisibility(): Promise<SectionVisibility> {
  const { data, error } = await supabase
    .from('section_settings')
    .select('section, visible');

  if (error) {
    console.warn(
      'Section settings are unavailable. Showing all public sections.',
      error,
    );
    return defaultSectionVisibility;
  }

  return (data ?? []).reduce(
    (visibility, row) => ({
      ...visibility,
      [row.section]: row.visible,
    }),
    defaultSectionVisibility,
  );
}

export async function getPortfolioContent() {
  const [personalInfo, projects, experiences, skills, sectionVisibility] =
    await Promise.all([
    getPersonalInfo(),
    getProjects(),
    getExperiences(),
    getSkills(),
      getSectionVisibility(),
    ]);

  return {
    personalInfo,
    projects,
    experiences,
    skills,
    sectionVisibility,
  };
}
