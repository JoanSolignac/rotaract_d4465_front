import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../shared/layouts/AuthLayout.jsx';
import PasswordField from '../../../shared/components/forms/PasswordField.jsx';
import TextField from '../../../shared/components/forms/TextField.jsx';
import useAuth from '../../../shared/hooks/useAuth.js';
import '../../../styles/auth.css';

const REGISTER_BACKGROUND =
  'https://images.unsplash.com/photo-1529397933903-60d90995b66c?q=80&w=2400&auto=format&fit=crop';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, status, error, clearError, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    club: '',
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
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
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
      const result = await register({
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        phone: formValues.phone.trim(),
        club: formValues.club.trim(),
      });

      if (result?.autoLogin) {
        setFeedback({
          type: 'success',
          message: 'Cuenta creada y sesión iniciada. Redirigiendo a tu panel…',
        });
        return;
      }

      setFeedback({
        type: 'success',
        message: 'Registro completado. Confirma tu correo y luego inicia sesión para activar tu cuenta.',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (registerError) {
      setFeedback({ type: 'error', message: registerError.message });
    }
  };

  const isSubmitting = status === 'pending';

  return (
    <AuthLayout backgroundImage={REGISTER_BACKGROUND}>
      <div className="auth-card__header">
        <h1 className="auth-card__title">Únete a Rotaract</h1>
        <p className="auth-card__subtitle">
          Construye proyectos de impacto y conecta con una red global de líderes jóvenes comprometidos con el servicio.
        </p>
      </div>

      {feedback && (
        <div className={`auth-feedback auth-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.message}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre y apellidos"
          name="fullName"
          placeholder="Nombre completo"
          value={formValues.fullName}
          onChange={handleChange}
          required
        />

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
          label="Crea una contraseña segura"
          name="password"
          autoComplete="new-password"
          value={formValues.password}
          onChange={handleChange}
          helperText="Utiliza al menos 8 caracteres combinando letras y números."
          required
        />

        <TextField
          label="Número de contacto"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+51 999 999 999"
          value={formValues.phone}
          onChange={handleChange}
        />

        <TextField
          label="Club de procedencia"
          name="club"
          placeholder="Ej. Rotaract Club Lima Norte"
          value={formValues.club}
          onChange={handleChange}
        />

        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-meta">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="auth-form__link">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
