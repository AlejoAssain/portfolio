import { AnimatedSection, SkillBadge } from '@/components/shared';
import { ExternalLink } from 'lucide-react';
import { usePortfolioContent } from '@/hooks';

export function Experience() {
  const { experiences } = usePortfolioContent();

  return (
    <section id="experience" className="py-24 lg:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-bold text-foreground">Experience</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {[...experiences]
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((exp, index) => (
              <AnimatedSection key={exp.id} delay={index * 100}>
                <article className="group relative grid md:grid-cols-[200px_1fr] gap-6 p-6 rounded-xl hover:bg-card transition-colors duration-300 border border-transparent hover:border-border">
                  <div className="space-y-2 text-sm text-muted-foreground font-mono">
                    <div>{exp.period}</div>
                    {exp.location && (
                      <div className="font-sans text-xs">{exp.location}</div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <header>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          ·{' '}
                        </span>
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-4"
                          >
                            {exp.company}
                            <ExternalLink size={14} className="opacity-50" />
                          </a>
                        ) : (
                          <span className="text-primary">{exp.company}</span>
                        )}
                      </h3>
                    </header>

                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <SkillBadge key={skill.id} name={skill.name} />
                      ))}
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
        </div>
      </div>
    </section>
  );
}
