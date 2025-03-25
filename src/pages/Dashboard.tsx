import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusCircle, Upload, Download, User } from "lucide-react";
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
        } catch (error: any) {
            toast.error(`Sync failed: ${error.message}`);
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
        } catch (error: any) {
            toast.error(`Sync failed: ${error.message}`);
        } finally {
            setIsSyncing(false);
        }
    };

    if (!notes) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8 mx-auto min-h-screen">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePushToServer}
                            disabled={isSyncing}
                            className="btn btn-secondary btn-sm inline-flex items-center gap-2"
                            title="Push notes to server"
                        >
                            <Upload size={18} />
                            <span className="hidden sm:inline">Push to Server</span>
                        </button>
                        <button
                            onClick={handlePullFromServer}
                            disabled={isSyncing}
                            className="btn btn-secondary btn-sm inline-flex items-center gap-2"
                            title="Pull notes from server"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Pull from Server</span>
                        </button>

                        {notes.length > 0 && (
                            <button
                                onClick={handleAddNote}
                                className="btn btn-primary btn-sm inline-flex items-center gap-2"
                            >
                                <PlusCircle size={18} />
                                <span>New Note</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/profile')}
                            className="btn btn-ghost btn-sm inline-flex items-center gap-2"
                            title="My Profile"
                        >
                            <User size={18} />
                            <span className="hidden sm:inline">Profile</span>
                        </button>

                        <button
                            onClick={() => {
                                db.signOut();
                                Cookies.remove("findit_auth");
                                window.location.href = "/";
                            }}
                            className="btn btn-error btn-outline btn-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mb-12">
                {notes.length === 0 ? (
                    <EmptyState onCreateNew={handleAddNote} />
                ) : (
                    <NoteList
                        notes={notes}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                    />
                )}
            </main>
            <footer>
                <div>current user email : {db.currentUser?.email || 'Not logged in'}</div>
            </footer>
        </div>
    );
};

export { Dashboard };
