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
  DeleteConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingState,
  PageHeader,
} from './shared';

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageToDelete, setMessageToDelete] =
    useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  async function remove() {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      await deleteContactMessage(messageToDelete.id);
      toast.success('Message deleted.');
      setMessageToDelete(null);
      await load();
    } catch (unknownError) {
      toast.error(
        unknownError instanceof Error ? unknownError.message : 'Delete failed.',
      );
    } finally {
      setDeleting(false);
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
                  onClick={() => setMessageToDelete(message)}
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
      <DeleteConfirmDialog
        open={Boolean(messageToDelete)}
        title="Delete message?"
        description={
          messageToDelete
            ? `This will permanently delete the message from ${messageToDelete.name}.`
            : ''
        }
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open) setMessageToDelete(null);
        }}
        onConfirm={remove}
      />
    </>
  );
}
