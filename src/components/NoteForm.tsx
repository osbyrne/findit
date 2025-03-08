
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Note } from "@/lib/db";
import { toast } from "sonner";

interface NoteFormProps {
  noteToEdit?: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

const NoteForm = ({ noteToEdit, onSave, onCancel }: NoteFormProps) => {
  const [title, setTitle] = useState(noteToEdit?.title || "");
  const [content, setContent] = useState(noteToEdit?.content || "");
  const isEditing = !!noteToEdit;

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
  }, [noteToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    const now = new Date();
    const note: Note = {
      ...noteToEdit,
      title: title.trim(),
      content: content.trim(),
      createdAt: noteToEdit?.createdAt || now,
      updatedAt: now,
    };
    
    onSave(note);
    setTitle("");
    setContent("");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">
          {isEditing ? "Edit Note" : "Create Note"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows={6}
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export {NoteForm} ;
