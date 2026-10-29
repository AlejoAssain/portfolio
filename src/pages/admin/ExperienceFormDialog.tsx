import type { FormEvent } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import type { ExperienceInput } from '@/services/admin';
import type { Skill } from '@/types';
import { LocalizedField } from './LocalizedField';
import { Field, SkillPicker } from './shared';

export function ExperienceFormDialog({
  open,
  editing,
  form,
  skills,
  onChange,
  onSubmit,
  onClose,
}: {
  open: boolean;
  editing: boolean;
  form: ExperienceInput;
  skills: Skill[];
  onChange: (form: ExperienceInput) => void;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Edit experience' : 'New experience'}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update the experience details and related skills.'
              : 'Add a new experience to the portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="ID / slug"
              value={form.id}
              disabled={editing}
              onChange={(event) => onChange({ ...form, id: event.target.value })}
              required
            />
            <Field
              label="Company"
              value={form.company}
              onChange={(event) =>
                onChange({ ...form, company: event.target.value })
              }
              required
            />
          </div>
          <LocalizedField
            label="Role"
            value={form.role}
            onChange={(role) => onChange({ ...form, role })}
            required
          />
          <LocalizedField
            label="Period"
            value={form.period}
            onChange={(period) => onChange({ ...form, period })}
            required
          />
          <LocalizedField
            label="Location"
            value={form.location}
            onChange={(location) => onChange({ ...form, location })}
          />
          <Field
            label="Company URL"
            type="url"
            value={form.companyUrl}
            onChange={(event) =>
              onChange({ ...form, companyUrl: event.target.value })
            }
          />
          <LocalizedField
            label="Description"
            textarea
            value={form.description}
            onChange={(description) => onChange({ ...form, description })}
            required
          />
          <SkillPicker
            skills={skills}
            selected={form.skillIds}
            onChange={(skillIds) => onChange({ ...form, skillIds })}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>{editing ? 'Save changes' : 'Create experience'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
