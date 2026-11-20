import { Icon } from '@iconify/react';
import { Fragment } from 'react';

import type { TripPlanCostItem } from '../../model/presentation';
import { TripPlanSection } from '../TripPlanSection/TripPlanSection';

import styles from './TripPlanCostSummary.module.scss';

export interface TripPlanCostSummaryProps {
  costs: readonly TripPlanCostItem[];
  totalLabel: string;
  totalNote?: string;
}

export function TripPlanCostSummary({
  costs,
  totalLabel,
  totalNote,
}: Readonly<TripPlanCostSummaryProps>) {
  return (
    <TripPlanSection
      className={styles.costSection}
      title="Итог по поездке"
      icon={<Icon icon="solar:clipboard-list-linear" />}
    >
      <div className={styles.costs}>
        {costs.map((cost) => (
          <Fragment key={cost.id}>
            <dl className={styles.costRow}>
              <dt>
                {cost.label}
                {cost.note && <span className={styles.fieldNote}>{cost.note}</span>}
              </dt>
              <dd>{cost.amount}</dd>
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
    </TripPlanSection>
  );
}
