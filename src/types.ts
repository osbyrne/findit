
interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    synced: boolean;
    serverNoteId: string;
    userId: string;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    notes: Note[];
}

export type { Note, UserProfile };