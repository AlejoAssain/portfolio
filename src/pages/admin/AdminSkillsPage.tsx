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
import { deleteSkill, saveSkill, saveSkillOrder } from '@/services/admin';
import { getSkills } from '@/services/portfolio';
import type { Skill } from '@/types';
import {
  EmptyState,
  ErrorMessage,
  Field,
  PageHeader,
  Panel,
} from './shared';

const categories: Skill['category'][] = [
  'backend',
  'database',
  'frontend',
  'infrastructure',
  'automation',
  'product',
];

const emptySkill: Skill = {
  id: '',
  displayOrder: 1,
  name: '',
  category: 'backend',
};

export function AdminSkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState<Skill>(emptySkill);
  const [editingId, setEditingId] = useState<string>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      setItems(await getSkills());
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
      await saveSkill(form, editingId);
      toast.success(editingId ? 'Skill updated.' : 'Skill created.');
      setForm(emptySkill);
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
    if (!window.confirm('Delete this skill? Related links may also be removed.'))
      return;
    try {
      await deleteSkill(id);
      toast.success('Skill deleted.');
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
    setForm(emptySkill);
  }

  function createSkill() {
    setEditingId(undefined);
    setForm({
      ...emptySkill,
      displayOrder:
        Math.max(0, ...items.map((item) => item.displayOrder)) + 1,
    });
    setDialogOpen(true);
  }

  function editSkill(skill: Skill) {
    setEditingId(skill.id);
    setForm(skill);
    setDialogOpen(true);
  }

  async function reorder(nextItems: Skill[]) {
    const previousItems = items;
    const orderedItems = nextItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
    setItems(orderedItems);
    setReordering(true);

    try {
      await saveSkillOrder(orderedItems.map((item) => item.id));
      toast.success('Skill order updated.');
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
        title="Skills"
        description="Manage the portfolio skill list."
        action={
          <Button onClick={createSkill}>
            <Plus />
            New skill
          </Button>
        }
      />
      <ErrorMessage error={error} />
      <Panel title={`${items.length} skills`}>
        {items.length === 0 ? (
          <EmptyState>No skills yet.</EmptyState>
        ) : (
          <SortableList
            items={items}
            onReorder={reorder}
            disabled={reordering}
            renderItem={(skill) => (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {skill.category}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => editSkill(skill)}
                    aria-label={`Edit ${skill.name}`}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => remove(skill.id)}
                    aria-label={`Delete ${skill.name}`}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit skill' : 'New skill'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update this skill and save your changes.'
                : 'Add a new skill to the portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submit}>
            <Field
              label="ID / slug"
              value={form.id}
              disabled={Boolean(editingId)}
              onChange={(event) => setForm({ ...form, id: event.target.value })}
              required
            />
            <Field
              label="Name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value as Skill['category'],
                  })
                }
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button>
                {editingId ? 'Save changes' : 'Create skill'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
