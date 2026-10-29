import { Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import { SortableList } from '@/components/admin';
import { errorMessage } from '@/lib/utils';
import {
  deleteProject,
  saveProject,
  saveProjectOrder,
  type ProjectInput,
} from '@/services/admin';
import { getProjects, getSkills } from '@/services/portfolio';
import type { ProjectContent, Skill } from '@/types';
import {
  DeleteConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
  Panel,
} from './shared';
import { ProjectFormDialog } from './ProjectFormDialog';
import { ProjectListItem } from './ProjectListItem';

const emptyProject: ProjectInput = {
  id: '',
  displayOrder: 1,
  title: { en: '' },
  description: { en: '' },
  github: '',
  demo: '',
  landing: '',
  image: '',
  featured: false,
  skillIds: [],
};

function projectToInput(project: ProjectContent): ProjectInput {
  return { ...project, skillIds: project.skills.map((skill) => skill.id) };
}

export function AdminProjectsPage() {
  const [items, setItems] = useState<ProjectContent[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<ProjectInput>(emptyProject);
  const [editingId, setEditingId] = useState<string>();
  const [projectToDelete, setProjectToDelete] =
    useState<ProjectContent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [projects, skillList] = await Promise.all([
        getProjects(),
        getSkills(),
      ]);
      setItems(projects);
      setSkills(skillList);
      setError('');
    } catch (unknownError) {
      setError(errorMessage(unknownError, 'Load failed.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => void load(), []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await saveProject(form, editingId);
      toast.success(editingId ? 'Project updated.' : 'Project created.');
      setForm(emptyProject);
      setEditingId(undefined);
      setDialogOpen(false);
      await load();
    } catch (unknownError) {
      toast.error(errorMessage(unknownError, 'Save failed.'));
    }
  }

  async function remove() {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      toast.success('Project deleted.');
      setProjectToDelete(null);
      await load();
    } catch (unknownError) {
      toast.error(errorMessage(unknownError, 'Delete failed.'));
    } finally {
      setDeleting(false);
    }
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(undefined);
    setForm(emptyProject);
  }

  function createProject() {
    setEditingId(undefined);
    setForm({
      ...emptyProject,
      displayOrder:
        Math.max(0, ...items.map((item) => item.displayOrder)) + 1,
    });
    setDialogOpen(true);
  }

  function editProject(project: ProjectContent) {
    setEditingId(project.id);
    setForm(projectToInput(project));
    setDialogOpen(true);
  }

  async function reorder(nextItems: ProjectContent[]) {
    const previousItems = items;
    const orderedItems = nextItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
    setItems(orderedItems);
    setReordering(true);

    try {
      await saveProjectOrder(orderedItems.map((item) => item.id));
      toast.success('Project order updated.');
    } catch (unknownError) {
      setItems(previousItems);
      toast.error(errorMessage(unknownError, 'Could not update the order.'));
    } finally {
      setReordering(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create projects, choose their skills and control their order."
        action={
          <Button onClick={createProject}>
            <Plus />
            New project
          </Button>
        }
      />
      <ErrorMessage error={error} />
      <Panel title={`${items.length} projects`}>
        {loading ? (
          <LoadingState label="Loading projects..." />
        ) : items.length === 0 ? (
          <EmptyState>No projects yet.</EmptyState>
        ) : (
          <SortableList
            items={items}
            onReorder={reorder}
            disabled={reordering}
            renderItem={(project) => (
              <ProjectListItem
                project={project}
                onEdit={() => editProject(project)}
                onDelete={() => setProjectToDelete(project)}
              />
            )}
          />
        )}
      </Panel>

      <ProjectFormDialog
        open={dialogOpen}
        editing={Boolean(editingId)}
        form={form}
        skills={skills}
        onChange={setForm}
        onSubmit={submit}
        onClose={closeDialog}
      />
      <DeleteConfirmDialog
        open={Boolean(projectToDelete)}
        title="Delete project?"
        description={
          projectToDelete
            ? `This will permanently delete "${projectToDelete.title.en}".`
            : ''
        }
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null);
        }}
        onConfirm={remove}
      />
    </>
  );
}
