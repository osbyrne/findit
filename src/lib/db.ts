
import Dexie, { Table } from 'dexie';

// Define the interface for our Note object
export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a Dexie database class
class NotesDatabase extends Dexie {
  notes!: Table<Note, number>;

  constructor() {
    super('notesDatabase');
    this.version(1).stores({
      notes: '++id, title, content, createdAt, updatedAt'
    });
  }
}

// Export a single instance of the database
export const db = new NotesDatabase();
