import snowyMountains from '@/assets/images/SnowyMountains.png';
import { ResultsHero } from '@/shared/ui/ResultsHero';
import { formatResultCount } from '@/widgets/travel-constructor';

interface ResortsHeroProps {
  totalCount: number;
}

export function ResortsHero({ totalCount }: ResortsHeroProps) {
  return (
    <ResultsHero
      id="resorts"
      title="Горнолыжные курорты"
      count={formatResultCount(totalCount)}
      description={
        <>
          Выберите подходящий и добавьте
          <br />в конструктор.
        </>
      }
      image={snowyMountains}
      imageAlt="Заснеженные горы и канатная дорога"
    />
  );
}
