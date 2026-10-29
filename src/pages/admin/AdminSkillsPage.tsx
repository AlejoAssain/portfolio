import { Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { SortableList } from '@/components/admin';
import { errorMessage } from '@/lib/utils';
import { deleteSkill, saveSkill, saveSkillOrder } from '@/services/admin';
import { getSkills } from '@/services/portfolio';
import type { Skill } from '@/types';
import {
  DeleteConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Panel,
} from './shared';
import { RowActions } from './RowActions';
import { SkillFormDialog } from './SkillFormDialog';

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
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setItems(await getSkills());
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
      await saveSkill(form, editingId);
      toast.success(editingId ? 'Skill updated.' : 'Skill created.');
      setForm(emptySkill);
      setEditingId(undefined);
      setDialogOpen(false);
      await load();
    } catch (unknownError) {
      toast.error(errorMessage(unknownError, 'Save failed.'));
    }
  }

  async function remove() {
    if (!skillToDelete) return;
    setDeleting(true);
    try {
      await deleteSkill(skillToDelete.id);
      toast.success('Skill deleted.');
      setSkillToDelete(null);
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
      toast.error(errorMessage(unknownError, 'Could not update the order.'));
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
        {loading ? (
          <LoadingState label="Loading skills..." />
        ) : items.length === 0 ? (
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
                <RowActions
                  name={skill.name}
                  onEdit={() => editSkill(skill)}
                  onDelete={() => setSkillToDelete(skill)}
                />
              </div>
            )}
          />
        )}
      </Panel>

      <SkillFormDialog
        open={dialogOpen}
        editing={Boolean(editingId)}
        form={form}
        onChange={setForm}
        onSubmit={submit}
        onClose={closeDialog}
      />
      <DeleteConfirmDialog
        open={Boolean(skillToDelete)}
        title="Delete skill?"
        description={
          skillToDelete
            ? `This will permanently delete "${skillToDelete.name}". Related links may also be removed.`
            : ''
        }
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open) setSkillToDelete(null);
        }}
        onConfirm={remove}
      />
    </>
  );
}
