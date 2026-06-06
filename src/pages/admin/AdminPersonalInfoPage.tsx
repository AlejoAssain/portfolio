import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { savePersonalInfo } from '@/services/admin';
import { getPersonalInfo } from '@/services/portfolio';
import type { PersonalInfo } from '@/types';
import { ErrorMessage, Field, PageHeader, Panel } from './shared';

const emptyInfo: PersonalInfo = {
  name: '',
  title: '',
  tagline: '',
  bio: '',
  email: '',
  location: '',
  status: '',
};

export function AdminPersonalInfoPage() {
  const [form, setForm] = useState<PersonalInfo>(emptyInfo);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPersonalInfo()
      .then(setForm)
      .catch((unknownError) =>
        setError(
          unknownError instanceof Error ? unknownError.message : 'Load failed.',
        ),
      );
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await savePersonalInfo(form);
      toast.success('Personal information updated.');
    } catch (unknownError) {
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Save failed.',
      );
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
      <div className="max-w-2xl">
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
                label="Professional title"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                required
              />
            </div>
            <Field
              label="Tagline"
              value={form.tagline}
              onChange={(event) =>
                setForm({ ...form, tagline: event.target.value })
              }
              required
            />
            <Field
              label="Bio"
              textarea
              value={form.bio}
              onChange={(event) =>
                setForm({ ...form, bio: event.target.value })
              }
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
              <Field
                label="Location"
                value={form.location}
                onChange={(event) =>
                  setForm({ ...form, location: event.target.value })
                }
                required
              />
            </div>
            <Field
              label="Status"
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
              required
            />
            <Button disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
