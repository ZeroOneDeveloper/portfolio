import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Index from "./pages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
