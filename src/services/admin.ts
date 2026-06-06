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

async function saveDisplayOrder(
  table: 'projects' | 'experiences' | 'skills',
  ids: string[],
) {
  const { error } = await supabase.rpc('reorder_admin_entities', {
    p_entity: table,
    p_ids: ids,
  });
  throwIfError(error);
}

export function saveProjectOrder(ids: string[]) {
  return saveDisplayOrder('projects', ids);
}

export function saveExperienceOrder(ids: string[]) {
  return saveDisplayOrder('experiences', ids);
}

export function saveSkillOrder(ids: string[]) {
  return saveDisplayOrder('skills', ids);
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
  const { error } = await supabase.rpc('delete_admin_entity', {
    p_entity: 'skills',
    p_id: id,
  });
  throwIfError(error);
}

export async function saveProject(input: ProjectInput, existingId?: string) {
  const { error } = await supabase.rpc('save_project_with_skills', {
    p_existing_id: existingId ?? null,
    p_id: input.id,
    p_display_order: input.displayOrder,
    p_title: input.title,
    p_description: input.description,
    p_github: input.github || null,
    p_demo: input.demo || null,
    p_landing: input.landing || null,
    p_image: input.image || null,
    p_featured: Boolean(input.featured),
    p_skill_ids: input.skillIds,
  });
  throwIfError(error);
}

export async function deleteProject(id: string) {
  const { error } = await supabase.rpc('delete_admin_entity', {
    p_entity: 'projects',
    p_id: id,
  });
  throwIfError(error);
}

export async function saveExperience(
  input: ExperienceInput,
  existingId?: string,
) {
  const { error } = await supabase.rpc('save_experience_with_skills', {
    p_existing_id: existingId ?? null,
    p_id: input.id,
    p_display_order: input.displayOrder,
    p_role: input.role,
    p_company: input.company,
    p_company_url: input.companyUrl || null,
    p_period: input.period,
    p_location: input.location || null,
    p_description: input.description,
    p_skill_ids: input.skillIds,
  });
  throwIfError(error);
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.rpc('delete_admin_entity', {
    p_entity: 'experiences',
    p_id: id,
  });
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
