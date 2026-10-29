import type { ProjectContent } from '@/types';
import { RowActions } from './RowActions';

export function ProjectListItem({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectContent;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="font-medium">
          {project.title.en}
          {project.featured && (
            <span className="ml-2 text-xs text-primary">Featured</span>
          )}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {project.description.en}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {project.skills.length} skills
        </p>
      </div>
      <RowActions name={project.title.en} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
