import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { AddNote } from "@/pages/AddNote";

export const router = createBrowserRouter([
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/add-note",
        element: <AddNote />,
    },
    {
        path: "/edit-note/:id",
        element: <AddNote />,
    },
]);
