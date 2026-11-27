import { Fragment, type ReactNode } from 'react';

import TripSummaryIcon from '@/assets/icons/constructor/TripSummaryIcon.svg?react';

import type { TripCostItem } from '../../model/presentation';
import { TripSection } from '../TripSection/TripSection';

import styles from './TripCostSummary.module.scss';

interface TripCostSummaryProps<T extends TripCostItem> {
  costs: readonly T[];
  totalLabel: string;
  totalNote?: string;
  renderRowControls?: (cost: T) => ReactNode;
}

export function TripCostSummary<T extends TripCostItem>({
  costs,
  totalLabel,
  totalNote,
  renderRowControls,
}: Readonly<TripCostSummaryProps<T>>) {
  return (
    <TripSection
      className={styles.costSection}
      title="Итог по поездке"
      icon={<TripSummaryIcon />}
    >
      <div className={styles.costs}>
        {costs.map((cost) => (
          <Fragment key={cost.id}>
            <dl className={styles.costRow}>
              <dt>
                {cost.label}
                {cost.note && <span className={styles.fieldNote}>{cost.note}</span>}
              </dt>
              <dd>
                <span>{cost.amount}</span>
                {renderRowControls?.(cost)}
              </dd>
            </dl>
            <div
              className={styles.divider}
              aria-hidden="true"
            />
          </Fragment>
        ))}
      </div>
      <div className={styles.total}>
        <h3>Итого</h3>
        <div>
          <p className={styles.totalAmount}>{totalLabel}</p>
          {totalNote && <p className={styles.totalNote}>{totalNote}</p>}
        </div>
      </div>
    </TripSection>
  );
}
