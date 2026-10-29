import { Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { errorMessage } from '@/lib/utils';
import {
  deleteSkill,
  saveSkill,
  saveSkillOrder,
  setSkillVisibility,
} from '@/services/admin';
import { getSkills } from '@/services/portfolio';
import { defaultLang } from '@/i18n/languages';
import type { SkillContent } from '@/types';
import {
  DeleteConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Panel,
} from './shared';
import { SkillFormDialog } from './SkillFormDialog';
import { SkillList } from './SkillList';

const emptySkill: SkillContent = {
  id: '',
  displayOrder: 1,
  name: { [defaultLang]: '' },
  category: 'backend',
  showInSkills: true,
};

export function AdminSkillsPage() {
  const [items, setItems] = useState<SkillContent[]>([]);
  const [form, setForm] = useState<SkillContent>(emptySkill);
  const [editingId, setEditingId] = useState<string>();
  const [skillToDelete, setSkillToDelete] = useState<SkillContent | null>(null);
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

  function editSkill(skill: SkillContent) {
    setEditingId(skill.id);
    setForm(skill);
    setDialogOpen(true);
  }

  async function toggleVisibility(skill: SkillContent) {
    const showInSkills = skill.showInSkills === false;
    const previousItems = items;
    setItems(
      items.map((item) =>
        item.id === skill.id ? { ...item, showInSkills } : item,
      ),
    );

    try {
      await setSkillVisibility(skill.id, showInSkills);
    } catch (unknownError) {
      setItems(previousItems);
      toast.error(errorMessage(unknownError, 'Could not update visibility.'));
    }
  }

  async function reorder(nextItems: SkillContent[]) {
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
          <SkillList
            items={items}
            disabled={reordering}
            onReorder={reorder}
            onToggleVisibility={toggleVisibility}
            onEdit={editSkill}
            onDelete={setSkillToDelete}
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
            ? `This will permanently delete "${skillToDelete.name[defaultLang]}". Related links may also be removed.`
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
