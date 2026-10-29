import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  experiences,
  personalInfo,
  projects,
  skills,
} from '@/mocks/portfolio';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  localizeExperience,
  localizePersonalInfo,
  localizeProject,
} from '@/mappers';
import { getPortfolioContent } from '@/services/portfolio';
import type {
  Experience,
  PersonalInfo,
  Project,
  SectionVisibility,
  Skill,
} from '@/types';

type PortfolioContent = {
  personalInfo: PersonalInfo;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  sectionVisibility: SectionVisibility;
};

type RemoteContent = Awaited<ReturnType<typeof getPortfolioContent>>;

type PortfolioContentState = PortfolioContent & {
  loading: boolean;
  error: Error | null;
  source: 'supabase' | 'fallback';
};

const fallbackContent: PortfolioContent = {
  personalInfo,
  projects,
  experiences,
  skills,
  sectionVisibility: {
    about: true,
    experience: true,
    projects: true,
    skills: true,
    contact: true,
  },
};

const PortfolioContentContext = createContext<PortfolioContentState | null>(
  null,
);

export function PortfolioContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { lang } = useLanguage();
  const [remote, setRemote] = useState<RemoteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [source, setSource] =
    useState<PortfolioContentState['source']>('fallback');

  useEffect(() => {
    let ignore = false;

    getPortfolioContent()
      .then((supabaseContent) => {
        if (!ignore) {
          setRemote(supabaseContent);
          setError(null);
          setSource('supabase');
        }
      })
      .catch((unknownError: unknown) => {
        if (!ignore) {
          const error =
            unknownError instanceof Error
              ? unknownError
              : new Error('Failed to load portfolio content.');

          console.error(
            '[portfolio] Supabase content failed to load; showing mock fallback data.',
            unknownError,
          );
          setError(error);
          setSource('fallback');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Every language is loaded up front, so switching only re-resolves.
  // ponytail: the mock fallback is English-only; translate it if Supabase
  // outages ever matter for Spanish visitors.
  const content = useMemo<PortfolioContent>(
    () =>
      remote
        ? {
            ...remote,
            personalInfo: localizePersonalInfo(remote.personalInfo, lang),
            projects: remote.projects.map((p) => localizeProject(p, lang)),
            experiences: remote.experiences.map((e) =>
              localizeExperience(e, lang),
            ),
          }
        : fallbackContent,
    [remote, lang],
  );

  const value = useMemo(
    () => ({
      ...content,
      loading,
      error,
      source,
    }),
    [content, loading, error, source],
  );

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContentContext);

  if (!context) {
    throw new Error(
      'usePortfolioContent must be used inside PortfolioContentProvider.',
    );
  }

  return context;
}
