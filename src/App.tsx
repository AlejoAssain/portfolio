import { PortfolioContentProvider } from '@/hooks';
import { Footer, Header } from '@/components/layout';
import { CursorGlow } from '@/components/shared';
import {
  About,
  Contact,
  Experience,
  Hero,
  Projects,
  Skills,
} from './components/sections';
import { Toaster } from '@/components/ui';

function App() {
  return (
    <PortfolioContentProvider>
      <div className="relative min-h-screen">
        <CursorGlow />

        <Header />

        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>

        <Footer />
        <Toaster />
      </div>
    </PortfolioContentProvider>
  );
}

export default App;
