import { PortfolioContentProvider, useMousePosition } from '@/hooks';
import { Footer, Header } from '@/components/layout';
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
  const { x, y } = useMousePosition();

  return (
    <PortfolioContentProvider>
      <div className="relative min-h-screen">
        {/* Cursor Glow Effect */}
        <div
          className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px at ${x}px ${y}px, rgba(100, 200, 180, 0.06), transparent 80%)`,
          }}
        />

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
