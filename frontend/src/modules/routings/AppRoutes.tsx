import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ButtonPlayground from '../Core/button/ButtonPlayground';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/core/button" replace />} />
        <Route path="/core/button" element={<ButtonPlayground />} />
      </Routes>
    </BrowserRouter>
  );
}
