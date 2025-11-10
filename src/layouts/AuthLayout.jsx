import NavBar from '../components/NavBar.jsx';
import AuthBackground from '../components/AuthBackground.jsx';

const AuthLayout = ({ children, backgroundImage }) => (
  <div className="auth-page">
    <AuthBackground image={backgroundImage} />
    <div className="navbar">
      <NavBar variant="auth" />
    </div>
    <div className="auth-content-card">{children}</div>
  </div>
);

export default AuthLayout;
