import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdminLayout, ProtectedAdminRoute } from '@/components/admin';
import { Footer, Header } from '@/components/layout';
import { CursorGlow } from '@/components/shared';
import { Toaster } from '@/components/ui';
import { AuthProvider } from '@/contexts/AuthContext';
import { PortfolioContentProvider, usePortfolioContent } from '@/hooks';
import {
  AdminDashboardPage,
  AdminExperiencesPage,
  AdminLoginPage,
  AdminMessagesPage,
  AdminPersonalInfoPage,
  AdminProjectsPage,
  AdminSkillsPage,
} from '@/pages/admin';
import {
  About,
  Contact,
  Experience,
  Hero,
  Projects,
  Skills,
} from './components/sections';

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
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
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
