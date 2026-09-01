import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [autofillActive, setAutofillActive] = useState(false);

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputType = type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;

  const isFloating = value.length > 0 || status === 'focus' || autofillActive;

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleInput = () => {
      const nv = input.value;
      if (nv) setAutofillActive(false);
      if (nv !== value) onChange(nv);
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, [value, onChange]);

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
          ref={inputRef}
          id={inputId}
          name={name}
          type={inputType}
          className={styles.input}
          autoComplete={autoComplete}
          placeholder={isFloating ? '' : placeholder}
          onAnimationStart={(e) => {
            if (e.animationName.includes('autofill')) {
              setAutofillActive(true);
            }
          }}
          onChange={(e) => {
            setAutofillActive(false);
            onChange(e.target.value);
          }}
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
            {isPasswordVisible ? (
              <Icon icon="mdi:eye" width="24" height="24" />
            ) : (
              <Icon icon="mdi:eye-off" width="24" height="24" />
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
