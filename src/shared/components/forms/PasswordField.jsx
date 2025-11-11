import { forwardRef, useId, useState } from 'react';

const PasswordField = forwardRef(
  (
    {
      label = 'Contraseña',
      helperText,
      error,
      name = 'password',
      id: idProp,
      required,
      toggleLabels = { show: 'Mostrar', hide: 'Ocultar' },
      className = '',
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const autoId = useId();
    const fieldId = idProp ?? `${name}-${autoId}`;
    const message = error ?? helperText;
    const describedBy = message ? `${fieldId}-message` : undefined;

    const handleToggle = () => {
      setVisible((previous) => !previous);
    };

    return (
      <div className={`form-control form-control--password ${className}`.trim()}>
        <div className="form-control__header">
          {label && (
            <label htmlFor={fieldId} className="form-control__label">
              {label}
              {required && <span className="form-control__required" aria-hidden="true">*</span>}
            </label>
          )}

          <button
            type="button"
            className="form-control__toggle"
            onClick={handleToggle}
            aria-pressed={visible}
          >
            {visible ? toggleLabels.hide : toggleLabels.show}
          </button>
        </div>

        <input
          ref={ref}
          id={fieldId}
          name={name}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          required={required}
          className="form-control__input"
          {...props}
        />

        {message && (
          <p id={describedBy} className={`form-control__message ${error ? 'is-error' : ''}`.trim()}>
            {message}
          </p>
        )}
      </div>
    );
  },
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
