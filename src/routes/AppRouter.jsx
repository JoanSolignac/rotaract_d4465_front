import { Routes, Route } from 'react-router-dom';
import DashboardDistritalPage from '../modules/dashboard/pages/DashboardDistritalPage.jsx';
import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegisterPage from '../modules/auth/pages/RegisterPage.jsx';
import PublicRoute from './PublicRoute.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const AppRouter = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/" element={<DashboardDistritalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
    </Route>
    <Route element={<PrivateRoute />}>
      {/* Add private routes here */}
    </Route>
  </Routes>
);

export default AppRouter;
