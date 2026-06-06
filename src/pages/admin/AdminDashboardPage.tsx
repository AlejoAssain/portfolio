import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import {
  getAdminContent,
  getSectionSettings,
  saveSectionSetting,
  type SectionKey,
  type SectionSetting,
} from '@/services/admin';
import { ErrorMessage, PageHeader, Panel } from './shared';

const sectionLabels: Record<SectionKey, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  contact: 'Contact',
};

const defaultSettings = Object.keys(sectionLabels).map((section) => ({
  section: section as SectionKey,
  visible: true,
}));

export function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    experiences: 0,
    skills: 0,
  });
  const [settings, setSettings] =
    useState<SectionSetting[]>(defaultSettings);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminContent(), getSectionSettings()])
      .then(([content, remoteSettings]) => {
        setCounts({
          projects: content.projects.length,
          experiences: content.experiences.length,
          skills: content.skills.length,
        });
        setSettings(
          defaultSettings.map(
            (fallback) =>
              remoteSettings.find(
                (setting) => setting.section === fallback.section,
              ) ?? fallback,
          ),
        );
      })
      .catch((unknownError) =>
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'Could not load the dashboard.',
        ),
      );
  }, []);

  async function toggleSection(setting: SectionSetting) {
    const next = { ...setting, visible: !setting.visible };
    setSettings((current) =>
      current.map((item) => (item.section === next.section ? next : item)),
    );

    try {
      await saveSectionSetting(next);
      toast.success(`${sectionLabels[next.section]} visibility updated.`);
    } catch (unknownError) {
      setSettings((current) =>
        current.map((item) =>
          item.section === setting.section ? setting : item,
        ),
      );
      toast.error(
        unknownError instanceof Error
          ? unknownError.message
          : 'Could not update visibility.',
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="A quiet little control room for your portfolio."
      />
      <ErrorMessage error={error} />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {Object.entries(counts).map(([label, count]) => (
          <div key={label} className="rounded-xl border bg-background p-5">
            <p className="text-sm capitalize text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{count}</p>
          </div>
        ))}
      </div>

      <Panel title="Public section visibility">
        <div className="divide-y">
          {settings.map((setting) => (
            <div
              key={setting.section}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{sectionLabels[setting.section]}</p>
                <p className="text-xs text-muted-foreground">
                  {setting.visible
                    ? 'Visible on the public portfolio'
                    : 'Hidden from visitors'}
                </p>
              </div>
              <Button
                variant={setting.visible ? 'outline' : 'secondary'}
                onClick={() => toggleSection(setting)}
              >
                {setting.visible ? <Eye /> : <EyeOff />}
                {setting.visible ? 'Visible' : 'Hidden'}
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
