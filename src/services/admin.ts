import { supabase } from '@/lib/supabase';
import {
  getExperiences,
  getPersonalInfo,
  getProjects,
  getSkills,
} from '@/services/portfolio';
import type {
  ContactMessage,
  ContactMessageRow,
  Experience,
  PersonalInfo,
  Project,
  Skill,
} from '@/types';
import { mapContactMessage } from '@/mappers';

export type ProjectInput = Omit<Project, 'skills'> & { skillIds: string[] };
export type ExperienceInput = Omit<Experience, 'skills'> & {
  skillIds: string[];
};
export type SkillInput = Skill;

export type SectionKey =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact';

export type SectionSetting = {
  section: SectionKey;
  visible: boolean;
};

function throwIfError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

export async function getAdminContent() {
  const [projects, experiences, skills, personalInfo] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getPersonalInfo(),
  ]);

  return { projects, experiences, skills, personalInfo };
}

export async function saveSkill(input: SkillInput, existingId?: string) {
  const payload = {
    id: input.id,
    display_order: input.displayOrder,
    name: input.name,
    category: input.category,
  };

  const query = existingId
    ? supabase.from('skills').update(payload).eq('id', existingId)
    : supabase.from('skills').insert(payload);
  const { error } = await query;
  throwIfError(error);
}

export async function deleteSkill(id: string) {
  const [{ error: projectError }, { error: experienceError }] =
    await Promise.all([
      supabase.from('project_skills').delete().eq('skill_id', id),
      supabase.from('experience_skills').delete().eq('skill_id', id),
    ]);
  throwIfError(projectError);
  throwIfError(experienceError);

  const { error } = await supabase.from('skills').delete().eq('id', id);
  throwIfError(error);
}

export async function saveProject(input: ProjectInput, existingId?: string) {
  const payload = {
    id: input.id,
    display_order: input.displayOrder,
    title: input.title,
    description: input.description,
    github: input.github || null,
    demo: input.demo || null,
    landing: input.landing || null,
    image: input.image || null,
    featured: Boolean(input.featured),
  };

  const projectQuery = existingId
    ? supabase.from('projects').update(payload).eq('id', existingId)
    : supabase.from('projects').insert(payload);
  const { error: projectError } = await projectQuery;
  throwIfError(projectError);

  const projectId = input.id;
  const { error: deleteError } = await supabase
    .from('project_skills')
    .delete()
    .eq('project_id', projectId);
  throwIfError(deleteError);

  if (input.skillIds.length > 0) {
    const { error } = await supabase.from('project_skills').insert(
      input.skillIds.map((skillId, index) => ({
        project_id: projectId,
        skill_id: skillId,
        display_order: index + 1,
      })),
    );
    throwIfError(error);
  }
}

export async function deleteProject(id: string) {
  const { error: relationError } = await supabase
    .from('project_skills')
    .delete()
    .eq('project_id', id);
  throwIfError(relationError);

  const { error } = await supabase.from('projects').delete().eq('id', id);
  throwIfError(error);
}

export async function saveExperience(
  input: ExperienceInput,
  existingId?: string,
) {
  const payload = {
    id: input.id,
    display_order: input.displayOrder,
    role: input.role,
    company: input.company,
    company_url: input.companyUrl || null,
    period: input.period,
    location: input.location || null,
    description: input.description,
  };

  const experienceQuery = existingId
    ? supabase.from('experiences').update(payload).eq('id', existingId)
    : supabase.from('experiences').insert(payload);
  const { error: experienceError } = await experienceQuery;
  throwIfError(experienceError);

  const experienceId = input.id;
  const { error: deleteError } = await supabase
    .from('experience_skills')
    .delete()
    .eq('experience_id', experienceId);
  throwIfError(deleteError);

  if (input.skillIds.length > 0) {
    const { error } = await supabase.from('experience_skills').insert(
      input.skillIds.map((skillId, index) => ({
        experience_id: experienceId,
        skill_id: skillId,
        display_order: index + 1,
      })),
    );
    throwIfError(error);
  }
}

export async function deleteExperience(id: string) {
  const { error: relationError } = await supabase
    .from('experience_skills')
    .delete()
    .eq('experience_id', id);
  throwIfError(relationError);

  const { error } = await supabase.from('experiences').delete().eq('id', id);
  throwIfError(error);
}

export async function savePersonalInfo(input: PersonalInfo) {
  const { error } = await supabase
    .from('personal_info')
    .update({
      name: input.name,
      title: input.title,
      tagline: input.tagline,
      bio: input.bio,
      email: input.email,
      location: input.location,
      status: input.status,
    })
    .eq('id', 'main');
  throwIfError(error);
}

export async function getSectionSettings(): Promise<SectionSetting[]> {
  const { data, error } = await supabase
    .from('section_settings')
    .select('section, visible')
    .order('section');
  throwIfError(error);
  return (data ?? []) as SectionSetting[];
}

export async function saveSectionSetting(setting: SectionSetting) {
  const { error } = await supabase
    .from('section_settings')
    .upsert(setting, { onConflict: 'section' });
  throwIfError(error);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  throwIfError(error);
  return (data ?? []).map((row) =>
    mapContactMessage(row as ContactMessageRow),
  );
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  throwIfError(error);
}
