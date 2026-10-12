import { ReadyTours } from '@/widgets/ready-tours/ui/ReadyTours';
import { ProgressBar, TravelConstructor } from '@/widgets/travel-constructor';
import { TRANSFER_PRICE_FROM } from '@/widgets/travel-constructor/config/transferOptions';
import { useConstructor } from '@/widgets/travel-constructor/model/constructorStore';

import style from './TripBuilderPage.module.scss';

function TripBuilderPage() {
  const applyReadyTour = useConstructor((state) => state.applyReadyTour);

  return (
    <div className={style.searchPageLayout}>
      <ProgressBar />
      <TravelConstructor />
      <ReadyTours
        onApply={(tour) =>
          applyReadyTour({
            destinationCity: tour.destinationCity,
            activityOption: tour.activityOption,
            transferType: tour.transferType,
            transferLabel: tour.transferType === 'needed' ? 'Нужен трансфер' : 'Доберусь самостоятельно',
            transferPriceFrom: tour.transferType === 'needed' ? TRANSFER_PRICE_FROM : undefined,
            level: tour.level,
          })
        }
      />
    </div>
  );
}

export default TripBuilderPage;
