import type { ReactNode } from 'react';

import { Button, Input, Label, Textarea } from '@/components/ui';
import type { Skill } from '@/types';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function Panel({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="self-start rounded-xl border bg-background p-5">
      <h2 className="mb-5 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  label,
  textarea,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  textarea?: boolean;
}) {
  const id = props.id ?? props.name;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {textarea ? (
        <Textarea
          {...(props as React.ComponentProps<typeof Textarea>)}
          id={id}
          rows={4}
        />
      ) : (
        <Input {...props} id={id} />
      )}
    </div>
  );
}

export function SkillPicker({
  skills,
  selected,
  onChange,
}: {
  skills: Skill[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Skills</Label>
      <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border p-3">
        {skills.map((skill) => {
          const active = selected.includes(skill.id);
          return (
            <Button
              key={skill.id}
              type="button"
              size="sm"
              variant={active ? 'default' : 'outline'}
              onClick={() =>
                onChange(
                  active
                    ? selected.filter((id) => id !== skill.id)
                    : [...selected, skill.id],
                )
              }
            >
              {skill.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function ErrorMessage({ error }: { error: string }) {
  return error ? <p className="text-sm text-destructive">{error}</p> : null;
}
