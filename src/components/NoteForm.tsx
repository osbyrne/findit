import { useState, useEffect, useRef } from "react";
import { X, Image, Trash } from "lucide-react";
import { Note } from "@/types";
import { toast } from "sonner";

interface NoteFormProps {
    noteToEdit?: Note;
    onSave: (note: Note) => void;
    onCancel: () => void;
}

const NoteForm = ({ noteToEdit, onSave, onCancel }: NoteFormProps) => {
    const [title, setTitle] = useState(noteToEdit?.title || "");
    const [content, setContent] = useState(noteToEdit?.content || "");
    const [image, setImage] = useState<string | undefined>(noteToEdit?.image);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!noteToEdit;

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
            setImage(noteToEdit.image);
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
            image: image,
        };

        onSave(note);
        setTitle("");
        setContent("");
        setImage(undefined);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {  // 5MB limit
            toast.error("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                    <label htmlFor="image" className="block text-sm font-medium">
                        Image
                    </label>
                    <div className="flex items-center gap-2">
                        <label className="btn btn-secondary btn-sm cursor-pointer">
                            <Image size={16} className="mr-2" />
                            {image ? 'Change Image' : 'Upload Image'}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                        {image && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="btn btn-outline btn-error btn-sm"
                            >
                                <Trash size={16} className="mr-2" />
                                Remove
                            </button>
                        )}
                    </div>

                    {image && (
                        <div className="mt-2 relative">
                            <img
                                src={image}
                                alt="Note preview"
                                className="w-full max-h-60 object-contain rounded-md border border-input"
                            />
                        </div>
                    )}
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

export { NoteForm };
