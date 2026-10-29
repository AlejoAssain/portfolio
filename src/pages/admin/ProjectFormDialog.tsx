import { useState, type FormEvent } from 'react';
import { ProjectScreenshots } from './ProjectScreenshots';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Switch,
} from '@/components/ui';
import type { ProjectInput } from '@/services/admin';
import type { SkillContent } from '@/types';
import { LocalizedField } from './LocalizedField';
import { Field, SkillPicker } from './shared';

export function ProjectFormDialog({
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
  form: ProjectInput;
  skills: SkillContent[];
  onChange: (form: ProjectInput) => void;
  onSubmit: (event: FormEvent) => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && !busy && !saving && onClose()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit project' : 'New project'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update the project details and related skills.'
              : 'Add a new project to the portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy || saving) return;
            setSaving(true);
            try {
              await onSubmit(event);
            } finally {
              setSaving(false);
            }
          }}
        >
          <fieldset disabled={busy || saving} className="space-y-4">
            <Field
              label="ID / slug"
              value={form.id}
              disabled={editing}
              onChange={(event) =>
                onChange({ ...form, id: event.target.value })
              }
              required
            />
            <LocalizedField
              label="Title"
              value={form.title}
              onChange={(title) => onChange({ ...form, title })}
              required
            />
            <LocalizedField
              label="Description"
              textarea
              value={form.description}
              onChange={(description) => onChange({ ...form, description })}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="GitHub URL"
                type="url"
                value={form.github}
                onChange={(event) =>
                  onChange({ ...form, github: event.target.value })
                }
              />
              <Field
                label="Demo URL"
                type="url"
                value={form.demo}
                onChange={(event) =>
                  onChange({ ...form, demo: event.target.value })
                }
              />
              <Field
                label="Landing URL"
                type="url"
                value={form.landing}
                onChange={(event) =>
                  onChange({ ...form, landing: event.target.value })
                }
              />
            </div>
            <Field
              id="project-video"
              label="YouTube video URL (optional)"
              type="url"
              value={form.videoUrl ?? ''}
              placeholder="https://www.youtube.com/watch?v=…"
              onChange={(event) =>
                onChange({ ...form, videoUrl: event.target.value })
              }
            />
            <ProjectScreenshots
              images={form.screenshots ?? []}
              onChange={(screenshots) => onChange({ ...form, screenshots })}
              onBusy={setBusy}
            />
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Featured project</p>
                <p className="text-xs text-muted-foreground">
                  Highlight this project in the main portfolio section.
                </p>
              </div>
              <Switch
                checked={Boolean(form.featured)}
                onCheckedChange={(featured) => onChange({ ...form, featured })}
                aria-label="Featured project"
              />
            </div>
            <SkillPicker
              skills={skills}
              selected={form.skillIds}
              onChange={(skillIds) => onChange({ ...form, skillIds })}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button>
                {saving
                  ? 'Saving…'
                  : editing
                    ? 'Save changes'
                    : 'Create project'}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
