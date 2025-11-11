import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../shared/layouts/AuthLayout.jsx';
import PasswordField from '../../../shared/components/forms/PasswordField.jsx';
import TextField from '../../../shared/components/forms/TextField.jsx';
import useAuth from '../../../shared/hooks/useAuth.js';
import '../../../styles/auth.css';

const LOGIN_BACKGROUND =
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2400&auto=format&fit=crop';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, status, error, clearError, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    remember: true,
  });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/panel', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setFeedback({ type: 'error', message: error });
    }
  }, [error]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (feedback) {
      setFeedback(null);
    }

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    try {
      await login(
        {
          email: formValues.email.trim(),
          password: formValues.password,
        },
        { remember: formValues.remember },
      );

      setFeedback({
        type: 'success',
        message: 'Inicio de sesión exitoso. Redirigiendo a tu panel…',
      });

      setTimeout(() => {
        navigate('/panel', { replace: true });
      }, 700);
    } catch (loginError) {
      setFeedback({ type: 'error', message: loginError.message });
    }
  };

  const isSubmitting = status === 'pending';

  return (
    <AuthLayout backgroundImage={LOGIN_BACKGROUND}>
      <div className="auth-card__header">
        <h1 className="auth-card__title">Bienvenido de vuelta</h1>
        <p className="auth-card__subtitle">
          Ingresa a la plataforma distrital para gestionar tus proyectos, reportes y convocatorias en minutos.
        </p>
      </div>

      {feedback && (
        <div className={`auth-feedback auth-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.message}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Correo institucional"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu.nombre@rotaract4465.org"
          value={formValues.email}
          onChange={handleChange}
          required
        />

        <PasswordField
          label="Contraseña"
          name="password"
          autoComplete="current-password"
          value={formValues.password}
          onChange={handleChange}
          required
        />

        <div className="auth-form__options">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={formValues.remember}
              onChange={handleChange}
            />
            Recordarme en este equipo
          </label>

          <a href="/#soporte" className="auth-form__link">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth-meta">
        ¿Aún no eres parte del distrito?{' '}
        <Link to="/signup" className="auth-form__link">
          Crea tu cuenta
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
