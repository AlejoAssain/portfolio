import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { SortableList } from '@/components/admin';
import {
  deleteExperience,
  saveExperience,
  saveExperienceOrder,
  type ExperienceInput,
} from '@/services/admin';
import { getExperiences, getSkills } from '@/services/portfolio';
import type { Experience, Skill } from '@/types';
import {
  EmptyState,
  ErrorMessage,
  Field,
  PageHeader,
  Panel,
  SkillPicker,
} from './shared';

const emptyExperience: ExperienceInput = {
  id: '',
  displayOrder: 1,
  role: '',
  company: '',
  companyUrl: '',
  period: '',
  location: '',
  description: '',
  skillIds: [],
};

function experienceToInput(experience: Experience): ExperienceInput {
  return {
    ...experience,
    skillIds: experience.skills.map((skill) => skill.id),
  };
}

export function AdminExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<ExperienceInput>(emptyExperience);
  const [editingId, setEditingId] = useState<string>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');

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
      setError(
        unknownError instanceof Error ? unknownError.message : 'Load failed.',
      );
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
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Save failed.',
      );
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await deleteExperience(id);
      toast.success('Experience deleted.');
      await load();
    } catch (unknownError) {
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Delete failed.',
      );
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

  function editExperience(experience: Experience) {
    setEditingId(experience.id);
    setForm(experienceToInput(experience));
    setDialogOpen(true);
  }

  async function reorder(nextItems: Experience[]) {
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
      toast.error(
        unknownError instanceof Error
          ? unknownError.message
          : 'Could not update the order.',
      );
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
        {items.length === 0 ? (
          <EmptyState>No experiences yet.</EmptyState>
        ) : (
          <SortableList
            items={items}
            onReorder={reorder}
            disabled={reordering}
            renderItem={(experience) => (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {experience.role} · {experience.company}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {experience.period}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {experience.skills.length} skills
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => editExperience(experience)}
                    aria-label={`Edit ${experience.role}`}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => remove(experience.id)}
                    aria-label={`Delete ${experience.role}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </Panel>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit experience' : 'New experience'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the experience details and related skills.'
                : 'Add a new experience to the portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submit}>
            <Field
              label="ID / slug"
              value={form.id}
              disabled={Boolean(editingId)}
              onChange={(event) =>
                setForm({ ...form, id: event.target.value })
              }
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Role"
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
                required
              />
              <Field
                label="Company"
                value={form.company}
                onChange={(event) =>
                  setForm({ ...form, company: event.target.value })
                }
                required
              />
              <Field
                label="Period"
                value={form.period}
                onChange={(event) =>
                  setForm({ ...form, period: event.target.value })
                }
                required
              />
              <Field
                label="Location"
                value={form.location}
                onChange={(event) =>
                  setForm({ ...form, location: event.target.value })
                }
              />
            </div>
            <Field
              label="Company URL"
              type="url"
              value={form.companyUrl}
              onChange={(event) =>
                setForm({ ...form, companyUrl: event.target.value })
              }
            />
            <Field
              label="Description"
              textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              required
            />
            <SkillPicker
              skills={skills}
              selected={form.skillIds}
              onChange={(skillIds) => setForm({ ...form, skillIds })}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button>
                {editingId ? 'Save changes' : 'Create experience'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
