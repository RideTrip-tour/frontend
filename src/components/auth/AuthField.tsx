import { useId } from 'react';
import styles from './AuthForm.module.scss';

export type AuthFieldStatus = 'default' | 'focus' | 'success' | 'error';

type Props = {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  placeholder?: string;
  status?: AuthFieldStatus;
  hint?: string;
  hintTone?: 'default' | 'success' | 'error';
  showToggle?: boolean;
  isPasswordVisible?: boolean;
  autoComplete?: string;
  onToggleVisibility?: () => void;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function AuthField({
  id,
  name,
  type = 'text',
  label,
  value,
  placeholder = '',
  status = 'default',
  hint,
  hintTone = 'default',
  showToggle = false,
  isPasswordVisible = false,
  autoComplete,
  onToggleVisibility,
  onChange,
  onFocus,
  onBlur
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputType = type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;

  const isFloating = value.length > 0 || status === 'focus';

  return (
    <div className={styles.fieldGroup}>
      <div
        className={`${styles.inputWrapper} ${
          status === 'focus'
            ? styles.focus
            : status === 'success'
              ? styles.success
              : status === 'error'
                ? styles.error
                : styles.default
        }`}
      >
        <input
          id={inputId}
          name={name}
          type={inputType}
          className={styles.input}
          value={value}
          placeholder={isFloating ? '' : placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <label
          htmlFor={inputId}
          className={`${styles.floatingLabel} ${isFloating ? styles.floating : ''} ${
            status === 'success' ? styles.labelSuccess : status === 'error' ? styles.labelError : ''
          }`}
        >
          {label}
        </label>

        {showToggle && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={onToggleVisibility}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {isPasswordVisible ? '◉' : '◌'}
          </button>
        )}
      </div>

      {hint && (
        <p
          className={`${styles.hint} ${
            hintTone === 'error'
              ? styles.hintError
              : hintTone === 'success'
                ? styles.hintSuccess
                : ''
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
