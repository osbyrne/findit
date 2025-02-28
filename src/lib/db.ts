
import Dexie, { Table } from 'dexie';
import { supabase } from "@/integrations/supabase/client";

// Define the interface for our Note object
export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  synced?: boolean;
  serverNoteId?: string;
}

// Create a Dexie database class
class NotesDatabase extends Dexie {
  notes!: Table<Note, number>;

  constructor() {
    super('notesDatabase');
    this.version(1).stores({
      notes: '++id, title, content, createdAt, updatedAt, synced, serverNoteId'
    });
  }

  // Push all local notes to Supabase
  async pushNotesToServer(): Promise<{ success: boolean; message: string }> {
    try {
      const allNotes = await this.notes.toArray();
      
      // Process each note
      for (const note of allNotes) {
        if (note.serverNoteId) {
          // Update existing note on server
          const { error } = await supabase
            .from('notes')
            .update({
              title: note.title,
              content: note.content,
              updated_at: note.updatedAt.toISOString()
            })
            .eq('id', note.serverNoteId);
          
          if (error) throw new Error(`Failed to update note: ${error.message}`);
        } else {
          // Create new note on server
          const { data, error } = await supabase
            .from('notes')
            .insert({
              title: note.title,
              content: note.content,
              created_at: note.createdAt.toISOString(),
              updated_at: note.updatedAt.toISOString()
            })
            .select()
            .single();
          
          if (error) throw new Error(`Failed to create note: ${error.message}`);
          
          // Update local note with server ID
          if (data && note.id) {
            await this.notes.update(note.id, {
              serverNoteId: data.id,
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
      // Get all notes from server
      const { data: serverNotes, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw new Error(`Failed to fetch notes: ${error.message}`);
      
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
            synced: true
          });
        } else {
          // Create new local note
          await this.notes.add({
            title: serverNote.title,
            content: serverNote.content,
            createdAt: new Date(serverNote.created_at),
            updatedAt: new Date(serverNote.updated_at),
            serverNoteId: serverNote.id,
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
}

// Export a single instance of the database
export const db = new NotesDatabase();
