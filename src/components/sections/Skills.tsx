import { AnimatedSection, SkillBadge } from '@/components/shared'
import { usePortfolioContent } from '@/hooks'
import { useLanguage } from '@/i18n/LanguageProvider'
import type { Skill } from '@/types'

const categories: Skill['category'][] = [
  'backend',
  'database',
  'frontend',
  'infrastructure',
  'automation',
  'product',
]

export function Skills() {
  const { skills } = usePortfolioContent()
  const { t } = useLanguage()

  return (
    <section id="skills" className="py-24 lg:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display text-h2 text-foreground">{t.skills.heading}</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <AnimatedSection key={category} delay={index * 100}>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.skills.categories[category]}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter(
                      (skill) =>
                        skill.category === category && skill.showInSkills !== false,
                    )
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((skill) => (
                      <SkillBadge key={skill.id} name={skill.name} icon={skill.icon} />
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
