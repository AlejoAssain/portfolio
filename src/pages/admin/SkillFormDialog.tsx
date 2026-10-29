import type { FormEvent } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import type { Skill, SkillContent } from '@/types';
import { LocalizedField } from './LocalizedField';
import { Field } from './shared';

const categories: Skill['category'][] = [
  'backend',
  'database',
  'frontend',
  'infrastructure',
  'automation',
  'product',
];

export function SkillFormDialog({
  open,
  editing,
  form,
  onChange,
  onSubmit,
  onClose,
}: {
  open: boolean;
  editing: boolean;
  form: SkillContent;
  onChange: (form: SkillContent) => void;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit skill' : 'New skill'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update this skill and save your changes.'
              : 'Add a new skill to the portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field
            label="ID / slug"
            value={form.id}
            disabled={editing}
            onChange={(event) => onChange({ ...form, id: event.target.value })}
            required
          />
          <LocalizedField
            label="Name"
            value={form.name}
            onChange={(name) => onChange({ ...form, name })}
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
                onChange({
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>
              {editing ? 'Save changes' : 'Create skill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
