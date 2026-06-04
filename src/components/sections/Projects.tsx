import { projects } from '@/mocks/portfolio';
import { AnimatedSection, SkillBadge, SpotlightCard } from '@/components/shared';
import { ExternalLink, Code2, ArrowUpRight } from 'lucide-react';

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
                  <header className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs text-primary font-mono uppercase tracking-wider">
                        Featured Project
                      </span>
                      <h3 className="text-xl font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <Code2 size={18} />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          aria-label={`View ${project.title} live`}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
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
                      <header className="flex items-start justify-between gap-4 mb-4">
                        <div className="p-2 rounded-lg bg-secondary">
                          <ArrowUpRight size={20} className="text-primary" />
                        </div>
                        <div className="flex items-center gap-3">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`View ${project.title} on GitHub`}
                            >
                              <Code2 size={18} />
                            </a>
                          )}
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`View ${project.title} live`}
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
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
