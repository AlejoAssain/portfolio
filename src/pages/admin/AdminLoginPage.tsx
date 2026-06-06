import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Button, Input, Label } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLoginPage() {
  const { isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await signIn(email, password);
      const destination =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? '/admin';
      navigate(destination, { replace: true });
    } catch (unknownError) {
      setError(
        unknownError instanceof Error ? unknownError.message : 'Login failed.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/40 px-4">
      <section className="w-full max-w-sm rounded-xl border bg-background p-7 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Restricted area
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Alejo's back office</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage the portfolio. If you're not Alejo, this is your
          cue to leave.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </section>
    </main>
  );
}
