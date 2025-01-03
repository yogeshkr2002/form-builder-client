import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Settings from "./pages/Settings";
import TypebotEditor from "./pages/TypebotEditor";
import FormResponse from "./pages/FormResponse";
import FormStats from "./pages/FormStats";
import FolderView from "./pages/FolderView.jsx";
import NotFound from "./pages/NotFound.jsx";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
            <Route path="/typebot/:id" element={<TypebotEditor />} />
            <Route path="/form/:id" element={<FormResponse />} />
            <Route path="/form/:id/stats" element={<FormStats />} />
            <Route
              path="/folder/:folderId"
              element={
                <PrivateRoute>
                  <FolderView />
                </PrivateRoute>
              }
            />
            <Route path="/shared/*" element={<NotFound />} />
            <Route path="/shared/:id/login" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
