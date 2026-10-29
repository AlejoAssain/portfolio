import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui';

/** Edit and delete buttons for a row in an admin list. */
export function RowActions({
  name,
  onEdit,
  onDelete,
}: {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
      >
        <Pencil />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onDelete}
        aria-label={`Delete ${name}`}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
