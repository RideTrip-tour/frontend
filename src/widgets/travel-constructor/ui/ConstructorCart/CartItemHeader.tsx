import { CloseIcon } from '@/assets/icons/constructor';
import styles from './ConstructorCart.module.scss';

interface CartItemHeaderProps {
  title: string;
  resetLabel: string;
  onReset: () => void;
}

export function CartItemHeader({
  title,
  resetLabel,
  onReset,
}: CartItemHeaderProps) {
  return (
    <div className={styles.cartItemHeader}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <button
        aria-label={resetLabel}
        className={styles.removeButton}
        onClick={onReset}
        title={resetLabel}
        type="button"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
