import { SortableList } from '@/components/admin';
import { skillCategories } from '@/data/skillCategories';
import { en } from '@/i18n/en';
import type { SkillContent } from '@/types';
import { SkillListItem } from './SkillListItem';

/** Admin skill list grouped by category; drag reorders within a category. */
export function SkillList({
  items,
  disabled,
  onReorder,
  onToggleVisibility,
  onEdit,
  onDelete,
}: {
  items: SkillContent[];
  disabled: boolean;
  onReorder: (items: SkillContent[]) => void;
  onToggleVisibility: (skill: SkillContent) => void;
  onEdit: (skill: SkillContent) => void;
  onDelete: (skill: SkillContent) => void;
}) {
  const groups = skillCategories.map((category) => ({
    category,
    skills: items.filter((skill) => skill.category === category),
  }));

  // The order RPC expects every skill, so rebuild the full list.
  function reorderGroup(category: string, reordered: SkillContent[]) {
    onReorder(
      groups.flatMap((group) =>
        group.category === category ? reordered : group.skills,
      ),
    );
  }

  return (
    <div className="space-y-8">
      {groups
        .filter((group) => group.skills.length > 0)
        .map(({ category, skills }) => (
          <div key={category}>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {en.skills.categories[category]} · {skills.length}
            </h3>
            <SortableList
              items={skills}
              onReorder={(reordered) => reorderGroup(category, reordered)}
              disabled={disabled}
              renderItem={(skill) => (
                <SkillListItem
                  skill={skill}
                  onToggleVisibility={() => onToggleVisibility(skill)}
                  onEdit={() => onEdit(skill)}
                  onDelete={() => onDelete(skill)}
                />
              )}
            />
          </div>
        ))}
    </div>
  );
}
