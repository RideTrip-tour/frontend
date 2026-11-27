import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { findTour, toConstructorPackage } from '@/entities/tour';
import type { ReadyTourPreset } from '@/widgets/ready-tours/model';
import { ReadyTours } from '@/widgets/ready-tours/ui/ReadyTours';
import { ProgressBar, TravelConstructor } from '@/widgets/travel-constructor';
import { TRANSFER_PRICE_FROM } from '@/widgets/travel-constructor/config/transferOptions';
import { useConstructor } from '@/widgets/travel-constructor/model/constructorStore';

import style from './TripBuilderPage.module.scss';

function TripBuilderPage() {
  const applyReadyTour = useConstructor((state) => state.applyReadyTour);
  const applyTourPackage = useConstructor((state) => state.applyTourPackage);
  const { hash, state } = useLocation();

  useEffect(() => {
    if (hash === '#all-ready-tours') {
      document.getElementById('all-ready-tours')?.scrollIntoView();
    } else if (state?.fromTour) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash, state]);

  function applyPreset(preset: ReadyTourPreset) {
    const tour = findTour(preset.tourId);
    if (tour) {
      applyTourPackage(toConstructorPackage(tour, []));
      return;
    }
    applyReadyTour({
      destinationCity: preset.destinationCity,
      activityOption: preset.activityOption,
      transferType: preset.transferType,
      transferLabel:
        preset.transferType === 'needed' ? 'Нужен трансфер' : 'Доберусь самостоятельно',
      transferPriceFrom: preset.transferType === 'needed' ? TRANSFER_PRICE_FROM : undefined,
      level: preset.level,
    });
  }

  return (
    <div className={style.searchPageLayout}>
      <ProgressBar />
      <TravelConstructor />
      <ReadyTours onApply={applyPreset} />
    </div>
  );
}

export default TripBuilderPage;
