import snowyMountains from '@/assets/images/SnowyMountains.png';
import BackLink from '@/shared/ui/base/BackLink';
import { ResultsHero } from '@/shared/ui/ResultsHero';
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
        <BackLink
          className={styles.back}
          onClick={onBack}
          text="К конструктору"
        />
      )}
      <ResultsHero
        id="partner-offers"
        title={
          isError || isSimilar || isEmpty ? 'Мы не нашли точных совпадений' : 'Мы подобрали для вас'
        }
        count={
          !isError && !isSimilar && !isEmpty && !isLoading
            ? formatResultCount(totalCount)
            : undefined
        }
        description={
          hasDescription ? (
            isSimilar ? (
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
            )
          ) : undefined
        }
        image={snowyMountains}
        imageAlt="Заснеженные горы и канатная дорога"
        variant={isError ? 'error' : 'default'}
      />
    </>
  );
}
