import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout.jsx';
import '../../../assets/styles/Auth.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <AuthLayout backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/155e5f94ce2a8acdc9063d5e7a0c9118b51dd7a4?width=3072">
      <div className="auth-header">
        <h1 className="auth-title">¡Bienvenido de nuevo!</h1>
        <p className="auth-subtitle">Rotaract nos mantiene conectados sin fronteras.</p>
      </div>

      <form className="auth-form auth-form-login">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input type="email" id="email" className="form-input" placeholder="" />
        </div>

        <div className="form-group">
          <div className="form-label-with-action">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.8822 4.88129L19.1463 4.14535C18.9383 3.93736 18.5543 3.96937 18.3143 4.25731L15.7541 6.80128C14.602 6.30533 13.3382 6.06533 12.0101 6.06533C8.05798 6.08127 4.6342 8.38524 2.98608 11.6974C2.89006 11.9054 2.89006 12.1614 2.98608 12.3374C3.75402 13.9054 4.90609 15.2014 6.34609 16.1774L4.2501 18.3053C4.0101 18.5453 3.97809 18.9293 4.13813 19.1373L4.87408 19.8733C5.08207 20.0812 5.46606 20.0492 5.70606 19.7613L19.754 5.7134C20.058 5.47354 20.09 5.08958 19.882 4.88156L19.8822 4.88129ZM12.8581 9.71318C12.5861 9.64916 12.2981 9.5692 12.0261 9.5692C10.6661 9.5692 9.57818 10.6572 9.57818 12.0171C9.57818 12.2891 9.64219 12.5771 9.72215 12.8491L8.65003 13.9051C8.33008 13.3452 8.15409 12.7211 8.15409 12.0172C8.15409 9.88919 9.86611 8.17717 11.9941 8.17717C12.6982 8.17717 13.3221 8.35315 13.8821 8.67311L12.8581 9.71318Z"
                  fill="white"
                  fillOpacity="0.8"
                />
                <path
                  d="M21.0342 11.6974C20.4742 10.5774 19.7381 9.56942 18.8262 8.75339L15.8502 11.6974V12.0174C15.8502 14.1453 14.1382 15.8574 12.0102 15.8574H11.6902L9.80225 17.7453C10.5063 17.8893 11.2422 17.9853 11.9623 17.9853C15.9144 17.9853 19.3382 15.6814 20.9863 12.3532C21.1302 12.1292 21.1302 11.9052 21.0342 11.6972L21.0342 11.6974Z"
                  fill="white"
                  fillOpacity="0.8"
                />
              </svg>
              <span>{showPassword ? 'Hide' : 'Hide'}</span>
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="form-input"
            placeholder=""
          />
          <a href="#forgot" className="forgot-password-link">
            Forget your password
          </a>
        </div>

        <div className="form-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_297_502)">
                <path
                  d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_297_502">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>Mantener inicio</span>
          </label>
        </div>

        <button type="submit" className="auth-submit-btn">
          Iniciar sesión
        </button>

        <p className="auth-terms">
          By signing up, you agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy,</a>{' '}
          including <a href="#cookies">cookie use.</a>
        </p>

        <p className="auth-switch-text">
          ¿Aún no formas parte? <Link to="/signup">Registrarse</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
