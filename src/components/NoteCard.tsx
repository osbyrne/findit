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
            className="note-card rounded-xl p-6 w-full animate-in bg-background border border-border shadow-sm hover:shadow-md transition-shadow relative"
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
            </div>

            {note.image ? (
                <div className="mb-4 rounded-md overflow-hidden">
                    <img
                        src={note.image}
                        alt={note.title}
                        className="w-full h-40 object-cover"
                    />
                </div>
            ) : (
                <div className="mb-4 p-2 bg-muted rounded-md text-muted-foreground text-xs text-center">
                    This note has no image
                </div>
            )}

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {truncate(note.content, 150)}
            </p>

            <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-muted-foreground">Updated {formattedDate}</span>

                {/* Mobile-first action buttons in bottom row */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(note)}
                        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Edit note"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(note.id!)}
                        className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center text-destructive transition-colors"
                        aria-label="Delete note"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { NoteCard };
