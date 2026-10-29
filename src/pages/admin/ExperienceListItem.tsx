import type { ExperienceContent } from '@/types';
import { RowActions } from './RowActions';

export function ExperienceListItem({
  experience,
  onEdit,
  onDelete,
}: {
  experience: ExperienceContent;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">
          {experience.role.en} · {experience.company}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {experience.period.en}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {experience.skills.length} skills
        </p>
      </div>
      <RowActions
        name={experience.role.en}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
