import { Icon } from '@iconify/react';

import type { PartnerOffersMode, PartnerOffersStatus } from '../../model/types';

import styles from './PartnerOffersBookingNotice.module.scss';

interface PartnerOffersBookingNoticeProps {
  status: PartnerOffersStatus;
  mode: PartnerOffersMode;
}

export function PartnerOffersBookingNotice({ status, mode }: PartnerOffersBookingNoticeProps) {
  if (status === 'error' || status === 'empty' || mode !== 'exact') return null;

  return (
    <aside className={styles.bookingInfo}>
      <Icon
        aria-hidden="true"
        className={styles.infoIcon}
        height={40}
        icon="material-symbols:info-rounded"
        width={40}
      />
      <div>
        <span className={styles.title}>Бронирование и оплата происходят на сайте партнёра.</span>
        <p className={styles.description}>Все параметры сохранены — заново искать не придётся.</p>
      </div>
    </aside>
  );
}
