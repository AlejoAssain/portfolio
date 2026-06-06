import { Mail, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui';
import {
  deleteContactMessage,
  getContactMessages,
} from '@/services/admin';
import type { ContactMessage } from '@/types';
import {
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
} from './shared';

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(initial = false) {
    if (initial) setLoading(true);
    try {
      setMessages(await getContactMessages());
      setError('');
    } catch (unknownError) {
      setError(
        unknownError instanceof Error ? unknownError.message : 'Load failed.',
      );
    } finally {
      if (initial) setLoading(false);
    }
  }

  useEffect(() => void load(true), []);

  async function remove(message: ContactMessage) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    try {
      await deleteContactMessage(message.id);
      toast.success('Message deleted.');
      await load();
    } catch (unknownError) {
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Delete failed.',
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Messages"
        description="Messages sent through the public contact form."
      />
      <ErrorMessage error={error} />
      {loading ? (
        <LoadingState label="Loading messages..." />
      ) : messages.length === 0 && !error ? (
        <EmptyState>No messages yet.</EmptyState>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className="rounded-xl border bg-background p-5"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{message.name}</h2>
                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail size={14} />
                    {message.email}
                  </a>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => remove(message)}
                  aria-label={`Delete message from ${message.name}`}
                >
                  <Trash2 />
                </Button>
              </header>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {message.message}
              </p>
              <time className="mt-4 block text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleString()}
              </time>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
