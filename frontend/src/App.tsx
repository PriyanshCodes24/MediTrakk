import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute, RoleProtectedRoute } from "./routes/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import EditProfile from "./pages/EditProfile";
import Register from "./pages/auth/Register";
// import Home from "./pages/Home";
import CreateAppointment from "./pages/CreateAppointment";
import MyReports from "./components/MyReports";
import UploadReport from "./pages/UploadReport";
import MyAppointments from "./components/MyAppointments";
import Delete from "./components/Delete";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect } from "react";
import ChangeRole from "./components/Admin/ChangeRole";

const AppRoutes = () => {
  const { loading } = useAuth();
  useEffect(() => {
    document.title = "Meditrakk";
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Checking Authentication...
      </div>
    );
  }
  return (
    <>
      <link rel="icon" href="/logo" />
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-appointment"
          element={
            <RoleProtectedRoute requiredRole="patient">
              <CreateAppointment />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-report"
          element={
            <ProtectedRoute>
              <UploadReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-role/:id"
          element={
            <RoleProtectedRoute requiredRole="admin">
              <ChangeRole />
            </RoleProtectedRoute>
          }
        />
        <Route path="/random" element={<Delete />} />
      </Routes>
      <Toaster position="top-left" reverseOrder={false} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
