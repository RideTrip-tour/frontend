import style from './TripBuilderPage.module.scss';
import { ProgressBar, TravelConstructor } from '@/widgets/travel-constructor';
import { ReadyTours } from "@/widgets/ready-tours/ui/ReadyTours";

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