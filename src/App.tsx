import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AdminAuthBoundary } from '@/components/admin/AdminAuthBoundary';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { Footer, Header } from '@/components/layout';
import { CursorGlow } from '@/components/shared';
import { Toaster } from '@/components/ui';
import { PortfolioContentProvider, usePortfolioContent } from '@/hooks';
import {
  About,
  Contact,
  Experience,
  Hero,
  Projects,
  Skills,
} from './components/sections';

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const AdminExperiencesPage = lazy(() =>
  import('@/pages/admin/AdminExperiencesPage').then((module) => ({
    default: module.AdminExperiencesPage,
  })),
);
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/AdminLoginPage').then((module) => ({
    default: module.AdminLoginPage,
  })),
);
const AdminMessagesPage = lazy(() =>
  import('@/pages/admin/AdminMessagesPage').then((module) => ({
    default: module.AdminMessagesPage,
  })),
);
const AdminPersonalInfoPage = lazy(() =>
  import('@/pages/admin/AdminPersonalInfoPage').then((module) => ({
    default: module.AdminPersonalInfoPage,
  })),
);
const AdminProjectsPage = lazy(() =>
  import('@/pages/admin/AdminProjectsPage').then((module) => ({
    default: module.AdminProjectsPage,
  })),
);
const AdminSkillsPage = lazy(() =>
  import('@/pages/admin/AdminSkillsPage').then((module) => ({
    default: module.AdminSkillsPage,
  })),
);

function RouteLoading() {
  return (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

function PortfolioPage() {
  const { sectionVisibility } = usePortfolioContent();

  return (
    <div className="relative min-h-screen">
      <CursorGlow />

      <Header />

      <main>
        <Hero />
        {sectionVisibility.about && <About />}
        {sectionVisibility.experience && <Experience />}
        {sectionVisibility.projects && <Projects />}
        {sectionVisibility.skills && <Skills />}
        {sectionVisibility.contact && <Contact />}
      </main>

      <Footer />
    </div>
  );
}

function PublicPortfolio() {
  return (
    <PortfolioContentProvider>
      <PortfolioPage />
    </PortfolioContentProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route element={<AdminAuthBoundary />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="experiences" element={<AdminExperiencesPage />} />
                <Route path="skills" element={<AdminSkillsPage />} />
                <Route
                  path="personal-info"
                  element={<AdminPersonalInfoPage />}
                />
                <Route path="messages" element={<AdminMessagesPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
