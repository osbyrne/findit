import { PGlite } from '@electric-sql/pglite';

// Create a new PGlite instance
export const pglite = new PGlite();

// Initialize the database with initial schema
export const initPgLite = async () => {
  try {
    await pglite.init();

    // Create notes table if it doesn't exist
    await pglite.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('PgLite initialized successfully');
    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to initialize PgLite:', errorMessage);
    return false;
  }
};

// Helper functions for notes
export const pgNotes = {
  // Get all notes for a user
  async getAllForUser(userId: string) {
    try {
      const result = await pglite.query(
        'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
        [userId]
      );
      return { success: true, data: result.rows };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to fetch notes:', errorMessage);
      return { success: false, error: 'Failed to fetch notes' };
    }
  },

  // Create a new note
  async create(note: { title: string; content: string; image?: string; user_id: string }) {
    try {
      const result = await pglite.query(
        'INSERT INTO notes (title, content, image, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [note.title, note.content, note.image || null, note.user_id]
      );
      return { success: true, data: result.rows[0] };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to create note:', errorMessage);
      return { success: false, error: 'Failed to create note' };
    }
  },

  // Update an existing note
  async update(id: number, note: { title?: string; content?: string; image?: string }) {
    try {
      const updateFields = [];
      const values = [];
      let counter = 1;

      if (note.title !== undefined) {
        updateFields.push(`title = $${counter}`);
        values.push(note.title);
        counter++;
      }

      if (note.content !== undefined) {
        updateFields.push(`content = $${counter}`);
        values.push(note.content);
        counter++;
      }

      if (note.image !== undefined) {
        updateFields.push(`image = $${counter}`);
        values.push(note.image);
        counter++;
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      values.push(id); // Add the id as the last parameter

      const result = await pglite.query(
        `UPDATE notes SET ${updateFields.join(', ')} WHERE id = $${counter} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Note not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to update note:', errorMessage);
      return { success: false, error: 'Failed to update note' };
    }
  },

  // Delete a note
  async delete(id: number) {
    try {
      const result = await pglite.query('DELETE FROM notes WHERE id = $1 RETURNING id', [id]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Note not found' };
      }

      return { success: true, data: { id } };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to delete note:', errorMessage);
      return { success: false, error: 'Failed to delete note' };
    }
  }
};