import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Switch,
} from '@/components/ui';
import { SortableList } from '@/components/admin';
import {
  deleteProject,
  saveProject,
  saveProjectOrder,
  type ProjectInput,
} from '@/services/admin';
import { getProjects, getSkills } from '@/services/portfolio';
import type { Project, Skill } from '@/types';
import {
  EmptyState,
  ErrorMessage,
  Field,
  LoadingState,
  PageHeader,
  Panel,
  SkillPicker,
} from './shared';

const emptyProject: ProjectInput = {
  id: '',
  displayOrder: 1,
  title: '',
  description: '',
  github: '',
  demo: '',
  landing: '',
  image: '',
  featured: false,
  skillIds: [],
};

function projectToInput(project: Project): ProjectInput {
  return { ...project, skillIds: project.skills.map((skill) => skill.id) };
}

export function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<ProjectInput>(emptyProject);
  const [editingId, setEditingId] = useState<string>();
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
      setError(
        unknownError instanceof Error ? unknownError.message : 'Load failed.',
      );
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
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Save failed.',
      );
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted.');
      await load();
    } catch (unknownError) {
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Delete failed.',
      );
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

  function editProject(project: Project) {
    setEditingId(project.id);
    setForm(projectToInput(project));
    setDialogOpen(true);
  }

  async function reorder(nextItems: Project[]) {
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
      toast.error(
        unknownError instanceof Error
          ? unknownError.message
          : 'Could not update the order.',
      );
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
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {project.title}
                    {project.featured && (
                      <span className="ml-2 text-xs text-primary">
                        Featured
                      </span>
                    )}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {project.skills.length} skills
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => editProject(project)}
                    aria-label={`Edit ${project.title}`}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => remove(project.id)}
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </Panel>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit project' : 'New project'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the project details and related skills.'
                : 'Add a new project to the portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submit}>
            <Field
              label="ID / slug"
              value={form.id}
              disabled={Boolean(editingId)}
              onChange={(event) =>
                setForm({ ...form, id: event.target.value })
              }
              required
            />
            <Field
              label="Title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
            />
            <Field
              label="Description"
              textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="GitHub URL"
                type="url"
                value={form.github}
                onChange={(event) =>
                  setForm({ ...form, github: event.target.value })
                }
              />
              <Field
                label="Demo URL"
                type="url"
                value={form.demo}
                onChange={(event) =>
                  setForm({ ...form, demo: event.target.value })
                }
              />
              <Field
                label="Landing URL"
                type="url"
                value={form.landing}
                onChange={(event) =>
                  setForm({ ...form, landing: event.target.value })
                }
              />
              <Field
                label="Image URL"
                type="url"
                value={form.image}
                onChange={(event) =>
                  setForm({ ...form, image: event.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Featured project</p>
                <p className="text-xs text-muted-foreground">
                  Highlight this project in the main portfolio section.
                </p>
              </div>
              <Switch
                checked={Boolean(form.featured)}
                onCheckedChange={(featured) =>
                  setForm({ ...form, featured })
                }
                aria-label="Featured project"
              />
            </div>
            <SkillPicker
              skills={skills}
              selected={form.skillIds}
              onChange={(skillIds) => setForm({ ...form, skillIds })}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button>
                {editingId ? 'Save changes' : 'Create project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
