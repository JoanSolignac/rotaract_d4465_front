import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage.jsx';
import LoginPage from '../../features/auth/pages/LoginPage.jsx';
import MemberDashboard from '../../features/home/pages/MemberDashboard.jsx';
import RegisterPage from '../../features/auth/pages/RegisterPage.jsx';
import PublicRoute from './PublicRoute.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const AppRouter = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path="/panel" element={<MemberDashboard />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRouter;
