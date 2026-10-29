import { youtubeUrl } from '@/lib/media';
import { ProjectGallery } from '@/components/shared/ProjectGallery';
import { AnimatedSection, SkillBadge, SpotlightCard } from '@/components/shared';
import { ArrowUpRight, Code2, ExternalLink, PanelsTopLeft } from 'lucide-react';
import { usePortfolioContent } from '@/hooks';
import type { Dictionary } from '@/i18n/en';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Project } from '@/types';

type ProjectLink = {
  label: string;
  href: string;
  icon: typeof Code2;
};

function getProjectLinks(
  project: Project,
  labels: Dictionary['projects']['links'],
): ProjectLink[] {
  return [
    youtubeUrl(project.videoUrl) && {
      label: labels.video,
      href: youtubeUrl(project.videoUrl)!,
      icon: ExternalLink,
    },
    project.github && {
      label: labels.github,
      href: project.github,
      icon: Code2,
    },
    project.demo && {
      label: labels.demo,
      href: project.demo,
      icon: ExternalLink,
    },
    project.landing && {
      label: labels.landing,
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
  const { t } = useLanguage();
  const links = getProjectLinks(project, t.projects.links);

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
              ? 'inline-flex h-8 items-center gap-1.5 rounded-md bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-[0.97] active:duration-[var(--duration-micro)]'
              : 'inline-flex h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground active:scale-[0.97] active:duration-[var(--duration-micro)]'
          }
          aria-label={t.projects.viewLink(project.title, label)}
        >
          <Icon size={compact ? 14 : 16} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}

export function Projects() {
  const { projects } = usePortfolioContent();
  const { t } = useLanguage();
  const orderedProjects = [...projects].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const featuredProjects = orderedProjects.filter((p) => p.featured);
  const otherProjects = orderedProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display text-h2 text-foreground">{t.projects.heading}</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="space-y-12 mb-16">
          {featuredProjects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 100}>
              <SpotlightCard className="group">
                <div className="space-y-4">
                  <ProjectGallery project={project} />
                  <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="text-mono-xs text-signal font-mono uppercase">
                        {t.projects.featured}
                      </span>
                      <h3 className="font-display text-h3 text-foreground mt-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <ProjectButtons project={project} />
                  </header>

                  <p className="text-body text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.skills.map((skill) => (
                      <SkillBadge key={skill.id} name={skill.name} icon={skill.icon} />
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
              <h3 className="font-display text-h4 text-foreground mb-6">
                {t.projects.other}
              </h3>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 50}>
                  <article className="group h-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <ProjectGallery project={project} />
                      <header className="flex flex-col gap-4 mb-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                        <div className="p-2 rounded-lg bg-secondary">
                          <ArrowUpRight size={20} className="text-primary" />
                        </div>
                        <ProjectButtons project={project} compact />
                      </header>

                      <h4 className="font-display text-h3 text-foreground group-hover:text-primary transition-colors mb-2">
                        {project.title}
                      </h4>

                      <p className="text-body-sm text-muted-foreground flex-1 mb-4">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skill.id}
                            className="text-mono-xs text-muted-foreground font-mono"
                          >
                            {skill.name}
                            {skillIndex <
                              Math.min(2, project.skills.length - 1) && (
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
