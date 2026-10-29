import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui';
import { defaultLang } from '@/i18n/languages';
import type { SkillContent } from '@/types';
import { RowActions } from './RowActions';

export function SkillListItem({
  skill,
  onToggleVisibility,
  onEdit,
  onDelete,
}: {
  skill: SkillContent;
  onToggleVisibility: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const name = skill.name[defaultLang];
  const visible = skill.showInSkills !== false;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className={visible ? undefined : 'opacity-50'}>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {skill.category}
          {!visible && ' · hidden'}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onToggleVisibility}
          aria-label={`${visible ? 'Hide' : 'Show'} ${name} in skills section`}
          aria-pressed={visible}
        >
          {visible ? <Eye /> : <EyeOff />}
        </Button>
        <RowActions name={name} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
