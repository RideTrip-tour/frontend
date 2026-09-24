import { ArrowRightIcon } from '@/assets/icons/constructor';
import { Button } from '@/shared/ui/base/Button';
import { formatPrice } from '@/widgets/travel-constructor/lib/formatters';
import styles from './ConstructorCart.module.scss';

interface CartSummaryProps {
  totalPrice: number;
  hasSelectedItems: boolean;
  onCheckout: () => void;
}

export function CartSummary({
  totalPrice,
  hasSelectedItems,
  onCheckout,
}: CartSummaryProps) {
  return (
    <>
      <div className={styles.totalRow}>
        <strong>Итого:</strong>
        <p>
          {hasSelectedItems && <span>от</span>}
          <b>{formatPrice(totalPrice)}</b>
          {hasSelectedItems && <span className={styles.c}>за человека</span>}
        </p>
      </div>

      <Button
        className={styles.checkoutButton}
        disabled={!hasSelectedItems}
        icon={<ArrowRightIcon aria-hidden="true" />}
        iconVariant="plain"
        onClick={onCheckout}
        text="К оформлению"
        variant="secondary"
      />
    </>
  );
}
