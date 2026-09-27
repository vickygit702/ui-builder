import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ButtonPlayground from "../Core/button/ButtonPlayground";
import WebsiteBuilder from "../Users/builder/WebsiteBuilder";
import LoginPage from "../Users/auth/LoginPage";
import ProtectedRoute from "../Users/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/users/builder" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/core/button" element={<ButtonPlayground />} />
        <Route
          path="/users/builder"
          element={
            <ProtectedRoute>
              <WebsiteBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={<Navigate to="/users/builder" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
