import { projects } from '@/mocks/portfolio';
import { AnimatedSection, SkillBadge, SpotlightCard } from '@/components/shared';
import { ArrowUpRight, Code2, ExternalLink, PanelsTopLeft } from 'lucide-react';
import type { Project } from '@/types';

type ProjectLink = {
  label: string;
  href: string;
  icon: typeof Code2;
};

function getProjectLinks(project: Project): ProjectLink[] {
  return [
    project.github && {
      label: 'GitHub',
      href: project.github,
      icon: Code2,
    },
    project.demo && {
      label: 'Demo',
      href: project.demo,
      icon: ExternalLink,
    },
    project.landing && {
      label: 'Landing',
      href: project.landing,
      icon: PanelsTopLeft,
    },
  ].filter(Boolean) as ProjectLink[];
}

function ProjectButtons({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const links = getProjectLinks(project);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            compact
              ? 'inline-flex h-8 items-center gap-1.5 rounded-md bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground'
              : 'inline-flex h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground'
          }
          aria-label={`View ${project.title} ${label}`}
        >
          <Icon size={compact ? 14 : 16} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}

export function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-bold text-foreground">Projects</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="space-y-12 mb-16">
          {featuredProjects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 100}>
              <SpotlightCard className="group">
                <div className="space-y-4">
                  <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="text-xs text-primary font-mono uppercase tracking-wider">
                        Featured Project
                      </span>
                      <h3 className="text-xl font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <ProjectButtons project={project} />
                  </header>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <SkillBadge key={tag} name={tag} />
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedSection>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <>
            <AnimatedSection>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Other Notable Projects
              </h3>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 50}>
                  <article className="group h-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <header className="flex flex-col gap-4 mb-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                        <div className="p-2 rounded-lg bg-secondary">
                          <ArrowUpRight size={20} className="text-primary" />
                        </div>
                        <ProjectButtons project={project} compact />
                      </header>

                      <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {project.title}
                      </h4>

                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-muted-foreground font-mono"
                          >
                            {tag}
                            {project.tags.indexOf(tag) <
                              Math.min(2, project.tags.length - 1) && (
                              <span className="mx-1">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
