import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusCircle, Upload, Download, User, LogOut } from "lucide-react";
import { db, Note } from "@/database/dexie";
import { NoteList } from "@/components/NoteList";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const navigate = useNavigate();

    // Fetch all notes sorted by updatedAt descending
    const notes = useLiveQuery(
        async () => {
            const allNotes = await db.notes.orderBy("updatedAt").reverse().toArray();
            return allNotes;
        },
        []
    );

    useEffect(() => {
        if (notes && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [notes, isInitialLoad]);

    const handleAddNote = () => {
        navigate("/add-note");
    };

    const handleEditNote = (note: Note) => {
        navigate(`/edit-note/${note.id}`);
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await db.notes.delete(id);
            toast.success("Note deleted successfully");
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Failed to delete note");
        }
    };

    const handlePushToServer = async () => {
        setIsSyncing(true);
        try {
            const result = await db.pushNotesToServer();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Sync failed: ${errorMessage}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handlePullFromServer = async () => {
        setIsSyncing(true);
        try {
            const result = await db.pullNotesFromServer();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Sync failed: ${errorMessage}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSignOut = () => {
        db.signOut();
        Cookies.remove("findit_auth");
        window.location.href = "/";
    };

    if (!notes) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8 mx-auto min-h-screen pb-20">
            <main className="mb-12">
                <div className="space-y-8">
                    {notes.length === 0 ? (
                        <EmptyState onCreateNew={handleAddNote} />
                    ) : (
                        <NoteList
                            notes={notes}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                        />
                    )}
                </div>
            </main>

            {/* Mobile-first fixed bottom action bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg flex justify-around items-center p-3 z-10">
                <button
                    onClick={handleAddNote}
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
                    title="Add Note"
                >
                    <PlusCircle size={24} />
                </button>

                <button
                    onClick={handlePushToServer}
                    disabled={isSyncing}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground disabled:opacity-50 shadow hover:shadow-md transition-shadow"
                    title="Push to Server"
                >
                    <Upload size={20} />
                </button>

                <button
                    onClick={handlePullFromServer}
                    disabled={isSyncing}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground disabled:opacity-50 shadow hover:shadow-md transition-shadow"
                    title="Pull from Server"
                >
                    <Download size={20} />
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow hover:shadow-md transition-shadow"
                    title="Profile"
                >
                    <User size={20} />
                </button>

                <button
                    onClick={handleSignOut}
                    className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shadow hover:shadow-md transition-shadow"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export { Dashboard };
