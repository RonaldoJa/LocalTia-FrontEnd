import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import PublicRoute from './core/auth/PublicRoute';
import Register from './features/auth/Register';
import ProtectedRoute from './core/auth/ProtectedRoute';
import Dashboard from './features/Dashboard';
import Login from './features/auth/Login';
import Layout from './components/Layout';
import Products from './features/product/Product';
import Local from './features/product/Local';
import Client from './features/product/Client';
import StockManagement from './features/sales-management/StockManagement';
import SalesManagement from './features/sales-management/SalesManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/locales" element={<Local />} />
              <Route path="/clients" element={<Client />} />
              <Route path="/stocks" element={<StockManagement />} />
              <Route path="/sales" element={<SalesManagement />} />
            </Route>
          </Route>

          {/* Ruta por defecto para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
