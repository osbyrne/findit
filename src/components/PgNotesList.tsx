import { useState, useEffect } from 'react';
import { pgNotes } from '@/database/pglite';
import { db } from '@/database/dexie';
import { Note } from '@/types';
import { toast } from 'sonner';

interface PgNote {
  id: number;
  title: string;
  content: string;
  image: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface PgNotesListProps {
  userId: string;
}

export const PgNotesList = ({ userId }: PgNotesListProps) => {
  const [notes, setNotes] = useState<PgNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await pgNotes.getAllForUser(userId);
        if (result.success) {
          setNotes(result.data);
        } else {
          setError(result.error as string);
          toast.error('Failed to load SQL notes');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching PgLite notes:', errorMessage);
        setError('Failed to fetch notes');
        toast.error('Error loading SQL notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [userId]);

  const convertToDexieNote = (pgNote: PgNote): Partial<Note> => {
    return {
      title: pgNote.title,
      content: pgNote.content,
      image: pgNote.image || undefined,
      updatedAt: new Date(pgNote.updated_at).getTime(),
    };
  };

  const importToDexie = async (pgNote: PgNote) => {
    try {
      const note = convertToDexieNote(pgNote);
      const id = await db.notes.add({
        ...note,
        title: note.title!,
        content: note.content!,
        createdAt: new Date().getTime(),
        updatedAt: note.updatedAt || new Date().getTime(),
        synced: true,
      });
      
      toast.success('Note imported to local database');
      return id;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error importing note to Dexie:', errorMessage);
      toast.error('Failed to import note');
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border p-6 bg-card shadow-sm animate-pulse">
        <h2 className="text-xl font-semibold mb-6">SQL Notes</h2>
        <div className="h-40 w-full bg-muted rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border p-6 bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-6">SQL Notes</h2>
        <div className="p-4 rounded-md bg-red-50 text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">PgLite may not be initialized properly</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="rounded-xl border border-border p-6 bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-6">SQL Notes</h2>
        <div className="p-4 rounded-md bg-muted text-center">
          <p>No SQL notes found</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="rounded-xl border border-border p-6 bg-card shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <span>SQL Notes</span>
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({notes.length})
        </span>
      </h2>
      
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 rounded-md border border-border bg-background hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{note.title}</h3>
              <button 
                onClick={() => importToDexie(note)}
                className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Import
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {note.content}
            </p>
            
            <div className="text-xs text-muted-foreground mt-2">
              Updated: {formatDate(note.updated_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};