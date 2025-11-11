import { forwardRef, useId } from 'react';

const TextField = forwardRef(({ label, helperText, error, name, id: idProp, required, className = '', ...props }, ref) => {
  const autoId = useId();
  const fieldId = idProp ?? `${name ?? 'field'}-${autoId}`;
  const message = error ?? helperText;
  const describedBy = message ? `${fieldId}-message` : undefined;

  return (
    <div className={`form-control ${className}`.trim()}>
      {label && (
        <label htmlFor={fieldId} className="form-control__label">
          {label}
          {required && <span className="form-control__required" aria-hidden="true">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={fieldId}
        name={name}
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
});

TextField.displayName = 'TextField';

export default TextField;
