import { AnimatedSection } from '@/components/shared'
import { usePortfolioContent } from '@/hooks'

export function About() {
  const { personalInfo } = usePortfolioContent()

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-bold text-foreground">About</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-12">
          <AnimatedSection delay={100} className="lg:col-span-2 space-y-6">
            {personalInfo.bio.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-muted-foreground leading-relaxed text-pretty"
              >
                {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <span key={i} className="text-foreground font-medium">
                        {part.slice(2, -2)}
                      </span>
                    )
                  }
                  return part
                })}
              </p>
            ))}
          </AnimatedSection>

          <AnimatedSection delay={200} direction="left">
            <div className="space-y-6 p-6 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Info
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                    Location
                  </dt>
                  <dd className="text-foreground mt-1">{personalInfo.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {personalInfo.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">
                    Status
                  </dt>
                  <dd className="text-foreground mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {personalInfo.status}
                  </dd>
                </div>
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
