import { createBrowserRouter } from "react-router-dom";
import { Index } from "@/pages/Index";
import { AddNote } from "@/pages/AddNote";
import { Login } from "@/pages/Login"; // assuming you have this
import { Register } from "@/pages/Register"; // assuming you have this

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/add-note",
    element: <AddNote />,
  },
  {
    path: "/edit-note/:id",
    element: <AddNote />,
  },
  // Add other routes as needed
]);
