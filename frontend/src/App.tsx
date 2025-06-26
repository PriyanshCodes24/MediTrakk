import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Checking Authentication
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
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
