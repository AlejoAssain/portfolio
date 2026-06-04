import { AnimatedSection, SkillBadge } from '@/components/shared'
import { usePortfolioContent } from '@/hooks'
import type { Skill } from '@/types'

const categories = [
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Databases' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'automation', label: 'Hardware & Automation' },
  { key: 'product', label: 'Product & Operations' },
] satisfies Array<{ key: Skill['category']; label: string }>

export function Skills() {
  const { skills } = usePortfolioContent()

  return (
    <section id="skills" className="py-24 lg:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-bold text-foreground">Skills</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection key={category.key} delay={index * 100}>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((skill) => skill.category === category.key)
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((skill) => (
                      <SkillBadge key={skill.id} name={skill.name} />
                    ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
