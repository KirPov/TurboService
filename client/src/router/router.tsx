import { createBrowserRouter } from "react-router-dom";
import AdminApplications from "../application/AdminApplications";
import ApplicationCreate from "../application/Create";
import AdminPanel from "../components/AdminPanel";
import Auth from "../pages/Auth";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Profile from "../pages/Profile";
import ServiceEmployeePanel from "../pages/ServicePanel";
import { ProtectedRoute } from "./protectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "application",
        element: <ApplicationCreate />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: "manager",
        element: (
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <AdminApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "service",
        element: (
          <ProtectedRoute allowedRoles={["SERVICE_EMPLOYEE"]}>
            <ServiceEmployeePanel />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
