import { FunctionsHttpError } from '@supabase/supabase-js';

import { assertSupabase, isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  mapExperience,
  mapPersonalInfo,
  mapProject,
  mapSkill,
} from '@/mappers';
import type {
  ContactMessageInput,
  ExperienceContent,
  ExperienceWithSkillsRow,
  PersonalInfoContent,
  PersonalInfoRow,
  ProjectContent,
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

export async function getProjects(): Promise<ProjectContent[]> {
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

export async function getExperiences(): Promise<ExperienceContent[]> {
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

export async function getPersonalInfo(): Promise<PersonalInfoContent> {
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
): Promise<void> {
  assertSupabase();
  const { data, error } = await supabase.functions.invoke<{
    ok?: boolean;
    error?: string;
  }>('submit-contact-message', {
    body: input,
  });

  // A non-2xx response carries the function's own `{ error }` body; surface
  // that instead of supabase-js's generic "non-2xx status code" message.
  if (error instanceof FunctionsHttpError) {
    const body = await error.context.json().catch(() => null);
    throw new Error(body?.error ?? 'Message could not be sent.');
  }

  if (error) {
    throw new Error('Message could not be sent. Check your connection.');
  }

  if (!data?.ok) {
    throw new Error(data?.error ?? 'Message could not be sent.');
  }
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

// Supabase can hang instead of failing outright; past this the mock content
// already on screen stays.
const CONTENT_TIMEOUT_MS = 8000;

export async function getPortfolioContent() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('Supabase did not respond in time.')),
      CONTENT_TIMEOUT_MS,
    );
  });

  // ponytail: a hung fetch keeps running after the timeout wins; pass an
  // AbortSignal into each query if that ever matters.
  try {
    return await Promise.race([fetchPortfolioContent(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPortfolioContent() {
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
