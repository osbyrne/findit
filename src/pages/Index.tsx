
import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusCircle } from "lucide-react";
import { db, Note } from "@/lib/db";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch all notes sorted by updatedAt descending
  const notes = useLiveQuery(
    async () => {
      const allNotes = await db.notes.orderBy("updatedAt").reverse().toArray();
      return allNotes;
    },
    []
  );

  useEffect(() => {
    // Only show initial load animation once
    if (notes && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [notes, isInitialLoad]);

  const handleAddNote = () => {
    setNoteToEdit(undefined);
    setShowForm(true);
  };

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
    setShowForm(true);
  };

  const handleSaveNote = async (note: Note) => {
    try {
      if (note.id) {
        // Update existing note
        await db.notes.update(note.id, note);
        toast.success("Note updated successfully");
      } else {
        // Add new note
        await db.notes.add(note);
        toast.success("Note created successfully");
      }
      setShowForm(false);
      setNoteToEdit(undefined);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await db.notes.delete(id);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setNoteToEdit(undefined);
  };

  if (!notes) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8 mx-auto min-h-screen">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-block px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full mb-2">
              Local Storage
            </span>
            <h1 className="text-3xl font-medium tracking-tight">My Notes</h1>
          </div>
          
          {notes.length > 0 && !showForm && (
            <button
              onClick={handleAddNote}
              className="btn-primary inline-flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>New Note</span>
            </button>
          )}
        </div>
      </header>

      <main className="mb-12">
        {showForm ? (
          <div className="glass-card rounded-xl p-6 shadow-sm">
            <NoteForm
              noteToEdit={noteToEdit}
              onSave={handleSaveNote}
              onCancel={handleCancelForm}
            />
          </div>
        ) : notes.length === 0 ? (
          <EmptyState onCreateNew={handleAddNote} />
        ) : (
          <NoteList
            notes={notes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        )}
      </main>

      <footer className="text-center text-sm text-muted-foreground">
        <p>Notes are stored locally in your browser's IndexedDB</p>
      </footer>
    </div>
  );
};

export default Index;
