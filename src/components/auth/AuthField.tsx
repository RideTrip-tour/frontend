import { useId } from 'react';
import styles from './AuthForm.module.scss';
import EyeIcon from '@/assets/icons/eye.svg';
import NonEyeIcon from '@/assets/icons/non-eye.svg';

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
  isLast: boolean;
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
  onBlur,
  isLast
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputType = type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;

  const isFloating = value.length > 0 || status === 'focus';

  return (
    <div className={`${styles.fieldGroup} ${isLast ? styles.lastFieldGroup : ''}`}>
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

        {/* надо подправить TODO */}
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
            {isPasswordVisible ? (
              <img src={EyeIcon} alt="Закрыть просмотр пароля" />
            ) : (
              <img src={NonEyeIcon} alt="Открыть просмотр пароля" />
            )}
          </button>
        )}
      </div>

      {hint && (
        <p
          className={`${styles.hint} ${styles.visible} ${
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
