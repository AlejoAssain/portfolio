import {
  BriefcaseBusiness,
  FolderKanban,
  Home,
  LogOut,
  Mail,
  Menu,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const links = [
  { to: '/admin', label: 'Overview', icon: Home, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  {
    to: '/admin/experiences',
    label: 'Experiences',
    icon: BriefcaseBusiness,
  },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/personal-info', label: 'Personal info', icon: UserRound },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
];

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <strong>Portfolio admin</strong>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </Button>
      </header>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r bg-background p-5 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8">
          <p className="text-lg font-semibold">Alejo's back office</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-5 space-y-2">
          <Button asChild variant="outline" className="w-full">
            <a href="/" target="_blank" rel="noreferrer">
              View portfolio
            </a>
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => signOut()}>
            <LogOut />
            Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="p-4 sm:p-8 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
