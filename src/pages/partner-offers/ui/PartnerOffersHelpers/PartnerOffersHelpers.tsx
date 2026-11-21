import { Icon } from '@iconify/react';

import type { PartnerOffersStatus } from '../../model/types';

import styles from './PartnerOffersHelpers.module.scss';

interface PartnerOffersHelpersProps {
  status: PartnerOffersStatus;
}

export function PartnerOffersHelpers({ status }: PartnerOffersHelpersProps) {
  if (status === 'error') return null;

  return (
    <section className={styles.helpers}>
      <article className={styles.helperCard}>
        <Icon
          aria-hidden="true"
          className={styles.helperQuestion}
          height={40}
          icon="mingcute:question-fill"
        />
        <div>
          <strong>Не знаете свой уровень? Мы поможем.</strong>
        </div>
        <button type="button">
          Определить
          <Icon
            aria-hidden="true"
            className={styles.helperArrow}
            height={28}
            icon="material-symbols:arrow-forward-rounded"
          />
        </button>
      </article>
      <article className={styles.helperCard}>
        <Icon
          aria-hidden="true"
          className={styles.helperShield}
          height={40}
          icon="material-symbols:shield-rounded"
        />
        <div>
          <strong>Ваши данные в безопасности</strong>
          <p>Мы не передаём личную информацию третьим лицам</p>
        </div>
        <button type="button">
          Подробнее
          <Icon
            aria-hidden="true"
            className={styles.helperArrow}
            height={28}
            icon="material-symbols:arrow-forward-rounded"
          />
        </button>
      </article>
    </section>
  );
}
