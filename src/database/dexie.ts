import Dexie, { Table } from 'dexie';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    synced: boolean;
    serverNoteId: string;
    localNoteId: number;
    userId: string;
    image: string; // Base64 encoded image or URL
}

class NotesDatabase extends Dexie {
    notes!: Table<Note, number>;
    currentUser: User | null = null;

    constructor() {
        super('notesDatabase');
        this.version(2).stores({
            notes: '++id, title, content, createdAt, updatedAt, synced, serverNoteId, userId'
        });

        // Initialize current user
        this.initAuthState();
    }

    async initAuthState() {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        this.currentUser = session?.user || null;

        // Set up auth state change listener
        supabase.auth.onAuthStateChange((_event, session) => {
            this.currentUser = session?.user || null;
        });
    }

    async pushNotesToServer(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this.currentUser) {
                return { success: false, message: "You must be logged in to sync notes" };
            }

            const allNotes = await this.notes.toArray();

            for (const note of allNotes) {
                if (note.serverNoteId) {
                    const { error } = await supabase
                        .from('notes')
                        .update({
                            title: note.title,
                            content: note.content,
                            updated_at: note.updatedAt.toISOString(),
                            user_id: this.currentUser.id
                        })
                        .eq('id', note.serverNoteId);

                    if (error) throw new Error(`Failed to update note: ${error.message}`);
                } else {
                    const { data, error } = await supabase
                        .from('notes')
                        .insert({
                            title: note.title,
                            content: note.content,
                            created_at: note.createdAt.toISOString(),
                            updated_at: note.updatedAt.toISOString(),
                            user_id: this.currentUser.id
                        })
                        .select()
                        .single();

                    if (error) throw new Error(`Failed to create note: ${error.message}`);

                    if (data && note.id) {
                        await this.notes.update(note.id, {
                            serverNoteId: data.id,
                            userId: this.currentUser.id,
                            synced: true
                        });
                    }
                }
            }

            return { success: true, message: "All notes pushed to server successfully" };
        } catch (error: any) {
            console.error("Error pushing notes to server:", error);
            return { success: false, message: error.message };
        }
    }

    // Pull all notes from Supabase
    async pullNotesFromServer(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this.currentUser) {
                return { success: false, message: "You must be logged in to sync notes" };
            }

            // Get all notes from server for current user
            const { data: serverNotes, error } = await supabase
                .from('notes')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) {
                throw new Error(`Failed to pull notes from server: ${error.message}`);
            }

            if (!serverNotes) {
                return { success: true, message: "No notes found on server" };
            }

            // Get all local notes to compare
            const localNotes = await this.notes.toArray();
            const localNotesByServerId = localNotes.reduce((map, note) => {
                if (note.serverNoteId) {
                    map[note.serverNoteId] = note;
                }
                return map;
            }, {} as Record<string, Note>);

            // Process each server note
            for (const serverNote of serverNotes) {
                const localNote = localNotesByServerId[serverNote.id];

                if (localNote) {
                    // Update existing local note
                    await this.notes.update(localNote.id!, {
                        title: serverNote.title,
                        content: serverNote.content,
                        updatedAt: new Date(serverNote.updated_at),
                        userId: serverNote.user_id,
                        synced: true
                    });
                } else {
                    // Create new local note
                    await this.notes.add({
                        id: 9, //bruh
                        title: serverNote.title,
                        content: serverNote.content,
                        createdAt: new Date(serverNote.created_at),
                        updatedAt: new Date(serverNote.updated_at),
                        serverNoteId: serverNote.id,
                        userId: serverNote.user_id,
                        synced: true
                    });
                }
            }

            return { success: true, message: "Notes pulled from server successfully" };
        } catch (error: any) {
            console.error("Error pulling notes from server:", error);
            return { success: false, message: error.message };
        }
    }

    // Sign up a new user
    async signUp(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw new Error(error.message);

            return {
                success: true,
                message: data.user ? "Signed up successfully" : "Please check your email to confirm your account"
            };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    // Sign in an existing user
    async signIn(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw new Error(error.message);

            return { success: true, message: "Signed in successfully" };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    // Sign out the current user
    async signOut(): Promise<{ success: boolean; message: string }> {
        try {
            this.currentUser = null;
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUser;
    }

    // Update user profile
    async updateProfile(displayName: string): Promise<{ success: boolean; message: string }> {
        try {
            if (!this.currentUser) {
                return { success: false, message: "You must be logged in to update your profile" };
            }

            const { error } = await supabase
                .from('profiles')
                .update({ display_name: displayName })
                .eq('id', this.currentUser.id);

            if (error) throw new Error(error.message);

            return { success: true, message: "Profile updated successfully" };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    async restoreUserSession(userData: User): Promise<void> {
        this.currentUser = userData;
    }

    // Get user profile
    async getProfile(): Promise<{ success: boolean; data?: any; message: string }> {
        try {
            if (!this.currentUser) {
                return { success: false, message: "You must be logged in to view your profile" };
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) throw new Error(error.message);

            return { success: true, data, message: "Profile retrieved successfully" };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}

// Export a single instance of the database
export const db = new NotesDatabase();