import { Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { SortableList } from '@/components/admin';
import { errorMessage } from '@/lib/utils';
import {
  deleteExperience,
  saveExperience,
  saveExperienceOrder,
  type ExperienceInput,
} from '@/services/admin';
import { getExperiences, getSkills } from '@/services/portfolio';
import type { ExperienceContent, SkillContent } from '@/types';
import {
  DeleteConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Panel,
} from './shared';
import { ExperienceFormDialog } from './ExperienceFormDialog';
import { ExperienceListItem } from './ExperienceListItem';

const emptyExperience: ExperienceInput = {
  id: '',
  displayOrder: 1,
  role: { en: '' },
  company: '',
  companyUrl: '',
  period: { en: '' },
  location: undefined,
  description: { en: '' },
  skillIds: [],
};

function experienceToInput(experience: ExperienceContent): ExperienceInput {
  return {
    ...experience,
    skillIds: experience.skills.map((skill) => skill.id),
  };
}

export function AdminExperiencesPage() {
  const [items, setItems] = useState<ExperienceContent[]>([]);
  const [skills, setSkills] = useState<SkillContent[]>([]);
  const [form, setForm] = useState<ExperienceInput>(emptyExperience);
  const [editingId, setEditingId] = useState<string>();
  const [experienceToDelete, setExperienceToDelete] =
    useState<ExperienceContent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [experiences, skillList] = await Promise.all([
        getExperiences(),
        getSkills(),
      ]);
      setItems(experiences);
      setSkills(skillList);
      setError('');
    } catch (unknownError) {
      setError(errorMessage(unknownError, 'Load failed.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => void load(), []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await saveExperience(form, editingId);
      toast.success(editingId ? 'Experience updated.' : 'Experience created.');
      setForm(emptyExperience);
      setEditingId(undefined);
      setDialogOpen(false);
      await load();
    } catch (unknownError) {
      toast.error(errorMessage(unknownError, 'Save failed.'));
    }
  }

  async function remove() {
    if (!experienceToDelete) return;
    setDeleting(true);
    try {
      await deleteExperience(experienceToDelete.id);
      toast.success('Experience deleted.');
      setExperienceToDelete(null);
      await load();
    } catch (unknownError) {
      toast.error(errorMessage(unknownError, 'Delete failed.'));
    } finally {
      setDeleting(false);
    }
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(undefined);
    setForm(emptyExperience);
  }

  function createExperience() {
    setEditingId(undefined);
    setForm({
      ...emptyExperience,
      displayOrder:
        Math.max(0, ...items.map((item) => item.displayOrder)) + 1,
    });
    setDialogOpen(true);
  }

  function editExperience(experience: ExperienceContent) {
    setEditingId(experience.id);
    setForm(experienceToInput(experience));
    setDialogOpen(true);
  }

  async function reorder(nextItems: ExperienceContent[]) {
    const previousItems = items;
    const orderedItems = nextItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
    setItems(orderedItems);
    setReordering(true);

    try {
      await saveExperienceOrder(orderedItems.map((item) => item.id));
      toast.success('Experience order updated.');
    } catch (unknownError) {
      setItems(previousItems);
      toast.error(errorMessage(unknownError, 'Could not update the order.'));
    } finally {
      setReordering(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Experiences"
        description="Manage roles, companies and their related skills."
        action={
          <Button onClick={createExperience}>
            <Plus />
            New experience
          </Button>
        }
      />
      <ErrorMessage error={error} />
      <Panel title={`${items.length} experiences`}>
        {loading ? (
          <LoadingState label="Loading experiences..." />
        ) : items.length === 0 ? (
          <EmptyState>No experiences yet.</EmptyState>
        ) : (
          <SortableList
            items={items}
            onReorder={reorder}
            disabled={reordering}
            renderItem={(experience) => (
              <ExperienceListItem
                experience={experience}
                onEdit={() => editExperience(experience)}
                onDelete={() => setExperienceToDelete(experience)}
              />
            )}
          />
        )}
      </Panel>

      <ExperienceFormDialog
        open={dialogOpen}
        editing={Boolean(editingId)}
        form={form}
        skills={skills}
        onChange={setForm}
        onSubmit={submit}
        onClose={closeDialog}
      />
      <DeleteConfirmDialog
        open={Boolean(experienceToDelete)}
        title="Delete experience?"
        description={
          experienceToDelete
            ? `This will permanently delete "${experienceToDelete.role.en}" at ${experienceToDelete.company}.`
            : ''
        }
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open) setExperienceToDelete(null);
        }}
        onConfirm={remove}
      />
    </>
  );
}
