import { Icon } from '@iconify/react';
import clsx from 'clsx';

import snowyMountains from '@/assets/images/SnowyMountains.png';
import { formatResultCount } from '@/widgets/travel-constructor';

import type { PartnerOffersMode, PartnerOffersStatus } from '../../model/types';

import styles from './PartnerOffersHero.module.scss';

interface PartnerOffersHeroProps {
  status: PartnerOffersStatus;
  mode: PartnerOffersMode;
  totalCount: number;
  onBack: () => void;
}

export function PartnerOffersHero({ status, mode, totalCount, onBack }: PartnerOffersHeroProps) {
  const isError = status === 'error';
  const isEmpty = status === 'empty';
  const isLoading = status === 'loading';
  const isSimilar = mode === 'similar';
  const hasDescription = !isError && !isEmpty;

  return (
    <>
      {!isError && (
        <button
          className={styles.back}
          onClick={onBack}
          type="button"
        >
          <Icon
            aria-hidden="true"
            className={styles.backIcon}
            icon="iconamoon:arrow-left-2"
          />
          К конструктору
        </button>
      )}
      <section
        aria-describedby={hasDescription ? 'partner-offers-description' : undefined}
        aria-labelledby="partner-offers-title"
        className={clsx(styles.hero, isError && styles.heroError)}
      >
        <div className={styles.heroCopy}>
          <h1
            className={styles.heroTitle}
            id="partner-offers-title"
          >
            {isError || isSimilar || isEmpty ? (
              'Мы не нашли точных совпадений'
            ) : (
              <>
                Мы подобрали для вас{' '}
                {!isLoading && (
                  <span className={styles.heroCount}>{formatResultCount(totalCount)}</span>
                )}
              </>
            )}
          </h1>
          {hasDescription && (
            <p
              className={styles.heroDescription}
              id="partner-offers-description"
            >
              {isSimilar ? (
                <>
                  Но нашли похожие варианты, которые
                  <br />
                  могут вам подойти.
                </>
              ) : (
                <>
                  Выберите подходящее предложение
                  <br />и перейдите к бронированию у партнёра
                </>
              )}
            </p>
          )}
        </div>
        <img
          alt="Заснеженные горы и канатная дорога"
          className={styles.heroImage}
          src={snowyMountains}
        />
      </section>
    </>
  );
}
