import { ReadyTours } from '@/widgets/ready-tours/ui/ReadyTours';
import { ProgressBar, TravelConstructor } from '@/widgets/travel-constructor';

import style from './TripBuilderPage.module.scss';

function TripBuilderPage() {
  return (
    <div className={style.searchPageLayout}>
      <ProgressBar />
      <TravelConstructor />
      <ReadyTours />
    </div>
  );
}

export default TripBuilderPage;
