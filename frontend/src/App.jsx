import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import PostLoad from "./pages/PostLoad";
import PostTruck from "./pages/PostTruck";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && role !== userRole) return <Navigate to="/login" />;

  return children;
};

const AppLayout = ({ children, role }) => (
  <ProtectedRoute role={role}>
    <Navbar />
    {children}
  </ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <AppLayout role="admin">
              <AdminDashboard />
            </AppLayout>
          }
        />

        <Route
          path="/driver"
          element={
            <AppLayout role="driver">
              <DriverDashboard />
            </AppLayout>
          }
        />

        <Route
          path="/post-load"
          element={
            <AppLayout role="customer">
              <PostLoad />
            </AppLayout>
          }
        />

        <Route
          path="/post-truck"
          element={
            <AppLayout role="driver">
              <PostTruck />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
