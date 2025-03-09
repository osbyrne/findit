
import { useState } from "react";
import { Edit2, Trash2, CloudOff, Check } from "lucide-react";
import { Note } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
  };
  
  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), { 
    addSuffix: true,
    includeSeconds: true
  });

  return (
    <div 
      className="note-card rounded-xl p-6 w-full animate-in"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-lg text-foreground">
            {truncate(note.title, 40)}
          </h3>
          {note.synced === false && (
            <span title="Not synced with server" className="text-yellow-500">
              <CloudOff size={16} />
            </span>
          )}
          {note.synced === true && (
            <span title="Synced with server" className="text-green-500">
              <Check size={16} />
            </span>
          )}
        </div>
        <div className={`flex space-x-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => onEdit(note)} 
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Edit note"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(note.id!)} 
            className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-muted transition-all"
            aria-label="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {truncate(note.content, 150)}
      </p>
      
      <div className="text-xs text-muted-foreground flex items-center mt-auto">
        <span>Updated {formattedDate}</span>
      </div>
    </div>
  );
};

export { NoteCard};
