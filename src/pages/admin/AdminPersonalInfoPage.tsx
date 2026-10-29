import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { errorMessage } from '@/lib/utils';
import { savePersonalInfo } from '@/services/admin';
import { getPersonalInfo } from '@/services/portfolio';
import type { PersonalInfoContent } from '@/types';
import {
  ErrorMessage,
  Field,
  LoadingState,
  PageHeader,
  Panel,
} from './shared';
import { LocalizedField } from './LocalizedField';

export function AdminPersonalInfoPage() {
  const [form, setForm] = useState<PersonalInfoContent | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPersonalInfo()
      .then(setForm)
      .catch((unknownError) =>
        setError(errorMessage(unknownError, 'Load failed.')),
      );
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    try {
      await savePersonalInfo(form);
      toast.success('Personal information updated.');
    } catch (unknownError) {
      toast.error(errorMessage(unknownError, 'Save failed.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Personal info"
        description="Content shared by the hero, about and contact areas."
      />
      <ErrorMessage error={error} />
      <div className="mx-auto max-w-3xl">
        {!form && !error ? (
          <LoadingState label="Loading personal information..." />
        ) : form ? (
          <Panel title="Main profile">
          <form className="space-y-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
            </div>
            <LocalizedField
              label="Professional title"
              value={form.title}
              onChange={(title) => setForm({ ...form, title })}
              required
            />
            <LocalizedField
              label="Tagline"
              value={form.tagline}
              onChange={(tagline) => setForm({ ...form, tagline })}
              required
            />
            <LocalizedField
              label="Bio"
              textarea
              value={form.bio}
              onChange={(bio) => setForm({ ...form, bio })}
              required
            />
            <LocalizedField
              label="Location"
              value={form.location}
              onChange={(location) => setForm({ ...form, location })}
              required
            />
            <LocalizedField
              label="Status"
              value={form.status}
              onChange={(status) => setForm({ ...form, status })}
              required
            />
            <div className="flex justify-end">
              <Button disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
          </Panel>
        ) : null}
      </div>
    </>
  );
}
