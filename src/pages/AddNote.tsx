import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, Note } from "@/database/dexie";
import { NoteForm } from "@/components/NoteForm";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const AddNote = () => {
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const noteId = params.id ? parseInt(params.id) : undefined;
  
  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        setIsLoading(true);
        try {
          const note = await db.notes.get(noteId);
          if (note) {
            setNoteToEdit(note);
          } else {
            toast.error("Note not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error loading note:", error);
          toast.error("Failed to load note");
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadNote();
  }, [noteId, navigate]);

  const handleSaveNote = async (note: Note) => {
    try {
      if (note.id) {
        // Update existing note
        await db.notes.update(note.id, {
          ...note,
          synced: false // Mark as not synced
        });
        toast.success("Note updated successfully");
      } else {
        // Add new note
        await db.notes.add({
          ...note,
          synced: false // Mark as not synced
        });
        toast.success("Note created successfully");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8 mx-auto min-h-screen">
      <header className="mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleCancel}
            className="btn btn-ghost btn-sm inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Back to Notes</span>
          </button>
          <h1 className="text-xl font-semibold ml-4">
            {noteToEdit ? "Edit Note" : "Create New Note"}
          </h1>
        </div>
      </header>

      <main className="mb-12">
        <div className="glass-card rounded-xl p-6 shadow-sm">
          <NoteForm
            noteToEdit={noteToEdit}
            onSave={handleSaveNote}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
};

export { AddNote };
