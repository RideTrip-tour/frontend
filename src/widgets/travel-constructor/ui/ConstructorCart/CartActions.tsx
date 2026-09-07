import type { ReactNode } from 'react';
import styles from './ConstructorCart.module.scss';

export interface CartAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface CartActionsProps {
  actions: CartAction[];
}

export function CartActions({ actions }: CartActionsProps) {
  return (
    <div className={styles.actions}>
      {actions.map((action) => (
        <button
          className={styles.actionButton}
          key={action.label}
          onClick={action.onClick}
          type="button"
        >
          <span aria-hidden="true" className={styles.actionIcon}>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}