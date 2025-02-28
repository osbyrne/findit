
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState = ({ onCreateNew }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="w-24 h-24 mb-6 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-foreground">No Notes Yet</h3>
      <p className="mt-2 mb-6 text-muted-foreground max-w-md">
        Create your first note to get started. Your notes will be stored locally and available even when offline.
      </p>
      <button
        onClick={onCreateNew}
        className="btn-primary inline-flex items-center gap-2"
      >
        <PlusCircle size={18} />
        <span>Create New Note</span>
      </button>
    </div>
  );
};

export default EmptyState;
