import React, { useContext, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

/* ================= ROOT REDIRECT ================= */
const RootRedirect = () => {
  const { user } = useContext(AppContext);

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin"
    ? <Navigate to="/admin" />
    : <Navigate to="/dashboard" />;
};

/* ================= APP ================= */
const App = () => {
  const { user } = useContext(AppContext);

  const showNavbar = useMemo(() => Boolean(user), [user]);

  return (
    <Router>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
        <Route path="/register" element={user ? <RootRedirect /> : <Register />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* PRIVATE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
