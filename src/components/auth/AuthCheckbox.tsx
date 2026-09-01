import type { ReactNode } from 'react';
import styles from './AuthForm.module.scss';

type AuthCheckboxProps = {
  checked: boolean;
  children: ReactNode;
  onChange: (checked: boolean) => void;
};

export default function AuthCheckbox({ checked, children, onChange }: AuthCheckboxProps) {
  return (
    <label className={styles.checkboxRow}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxBox}>{checked ? '✓' : ''}</span>
      <span className={styles.checkboxText}>{children}</span>
    </label>
  );
}
