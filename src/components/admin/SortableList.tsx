import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type SortableItem = {
  id: string;
};

function SortableRow<T extends SortableItem>({
  item,
  renderItem,
  disabled,
}: {
  item: T;
  renderItem: (item: T) => ReactNode;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'flex items-center gap-2 border-b py-3 last:border-b-0',
        isDragging && 'relative z-10 rounded-md border bg-background shadow-lg',
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        disabled={disabled}
        aria-label={`Reorder ${item.id}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical />
      </Button>
      <div className="min-w-0 flex-1">{renderItem(item)}</div>
    </div>
  );
}

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  disabled = false,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableRow
            key={item.id}
            item={item}
            renderItem={renderItem}
            disabled={disabled}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
