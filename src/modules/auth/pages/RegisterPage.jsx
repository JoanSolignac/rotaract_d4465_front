import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout.jsx';
import '../../../assets/styles/Auth.css';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout backgroundImage="https://api.builder.io/api/v1/image/assets/TEMP/615a77780ec4a3b896e34aa80b6987cc9ba0f285?width=3072">
      <div className="auth-header">
        <h1 className="auth-title">¡Únete a a Rotaract!</h1>
        <p className="auth-subtitle">
          !Forma parte de una red mundial de más de 7 millones de voluntarios¡
        </p>
      </div>

      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="fullname" className="form-label">
            Nombre y Apellidos
          </label>
          <input type="text" id="fullname" className="form-input" placeholder="" />
        </div>

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
                  d="M19.8825 4.88128L19.1465 4.14533C18.9385 3.93734 18.5545 3.96935 18.3145 4.2573L15.7543 6.80126C14.6023 6.30532 13.3384 6.06532 12.0103 6.06532C8.05822 6.08126 4.63444 8.38523 2.98633 11.6974C2.8903 11.9054 2.8903 12.1614 2.98633 12.3373C3.75426 13.9054 4.90633 15.2014 6.34633 16.1773L4.25034 18.3053C4.01034 18.5453 3.97833 18.9293 4.13838 19.1373L4.87432 19.8732C5.08231 20.0812 5.4663 20.0492 5.7063 19.7613L19.7542 5.71339C20.0582 5.47352 20.0902 5.08956 19.8822 4.88155L19.8825 4.88128ZM12.8583 9.71316C12.5863 9.64914 12.2984 9.56919 12.0264 9.56919C10.6663 9.56919 9.57842 10.6572 9.57842 12.0171C9.57842 12.2891 9.64244 12.5771 9.72239 12.8491L8.65028 13.9051C8.33032 13.3452 8.15433 12.7211 8.15433 12.0172C8.15433 9.88918 9.86636 8.17715 11.9943 8.17715C12.6984 8.17715 13.3224 8.35314 13.8823 8.6731L12.8583 9.71316Z"
                  fill="white"
                  fillOpacity="0.8"
                />
                <path
                  d="M21.0344 11.6974C20.4745 10.5773 19.7384 9.56939 18.8265 8.75336L15.8504 11.6974V12.0173C15.8504 14.1453 14.1384 15.8573 12.0104 15.8573H11.6905L9.80249 17.7453C10.5065 17.8893 11.2425 17.9853 11.9625 17.9853C15.9146 17.9853 19.3384 15.6813 20.9865 12.3532C21.1305 12.1291 21.1305 11.9052 21.0345 11.6972L21.0344 11.6974Z"
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
        </div>

        <div className="form-divider">
          <div className="divider-line" />
          <span className="divider-text">O</span>
          <div className="divider-line" />
        </div>

        <button type="submit" className="auth-submit-btn">
          Crear cuenta
        </button>

        <p className="auth-terms">
          By signing up, you agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy,</a>{' '}
          including <a href="#cookies">cookie use.</a>
        </p>

        <p className="auth-switch-text">
          ¿Ya formas parte? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
