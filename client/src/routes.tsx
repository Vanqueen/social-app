import { createBrowserRouter, type RouteObject } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import ErrorPage from "./pages/ErrorPage";
import Message from "./pages/Message";
import MessageList from "./components/MessageList";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import SinglePost from "./pages/SinglePost";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "messages", element: <Message /> },
      { path: "messages/:receiveId", element: <MessageList /> },
      { path: "bookmarks", element: <Bookmarks /> },
      { path: "users/:id", element: <Profile /> },
      { path: "posts/:id", element: <SinglePost /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/logout", element: <Logout /> },
];

const router = createBrowserRouter(routes);

export default router;
