import { Note } from "@/types";
import {NoteCard} from "@/components/NoteCard";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteList = ({ notes, onEdit, onDelete }: NoteListProps) => {
  return (
    <div className="rounded-xl border border-border p-6 bg-card shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <span>Your Notes</span>
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({notes.length})
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {notes.map((note) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export {NoteList};
