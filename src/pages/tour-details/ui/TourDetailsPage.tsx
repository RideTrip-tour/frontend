import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import { ArrowRightIcon } from '@/assets/icons/constructor';
import { ResortRating, ResortStatus } from '@/entities/resort';
import {
  calculateTourAddonCost,
  calculateTourPackageTotal,
  findTour,
  findTourResort,
  formatTourAddonQuantity,
  toConstructorPackage,
  useTourFavorite,
  type TourAddon,
  type TourDetails,
} from '@/entities/tour';
import { TripCostSummary, TripHero } from '@/entities/trip';
import { BackLink } from '@/shared/ui/base';
import { Button } from '@/shared/ui/Button';
import { QuantityStepper } from '@/shared/ui/QuantityStepper';
import { useAuthStore } from '@/store';
import { useConstructor } from '@/widgets/travel-constructor';
import { formatPrice } from '@/widgets/travel-constructor/lib/formatters';

import { useTourAddons } from '../model/useTourAddons';
import {
  ResortInfrastructureSection,
  ResortTrailSection,
  TourOverviewSection,
  TourReviewsSection,
} from './TourContentSections';
import { TourExtrasSection } from './TourExtrasSection';

import styles from './TourDetailsPage.module.scss';

function TourView({ tour }: Readonly<{ tour: TourDetails }>) {
  const { itinerary, overview, offers, reviews } = tour;
  const resort = findTourResort(tour);
  const navigate = useNavigate();
  const location = useLocation();
  const fromBuilder = location.state?.tourSource === 'ready-tours';
  const applyPackage = useConstructor((state) => state.applyTourPackage);
  const userId = useAuthStore((state) => state.user?.id);
  const favorite = useTourFavorite(itinerary.tourId, userId);
  const { selected, quantities, setQuantity } = useTourAddons(tour);
  const base = formatPrice(itinerary.basePricePerPerson);
  const total = calculateTourPackageTotal({
    basePricePerPerson: itinerary.basePricePerPerson,
    addons: selected,
  });
  const costs: Array<{ id: string; label: string; amount: string; addon?: TourAddon }> = [
    { id: 'base', label: `Тур «${itinerary.title}»`, amount: base },
    ...selected.map((addon) => ({
      id: addon.id,
      label: `${addon.label} (${formatTourAddonQuantity(addon)})`,
      amount: formatPrice(calculateTourAddonCost(addon)),
      addon,
    })),
  ];

  function openConstructor() {
    applyPackage(toConstructorPackage(tour, selected));
    void navigate('/trip-builder', { state: { fromTour: true } });
  }

  return (
    <div className={styles.page}>
      <BackLink
        className={styles.back}
        text={fromBuilder ? 'К готовым вариантам' : 'На главную'}
        to={fromBuilder ? '/trip-builder#all-ready-tours' : '/'}
      />
      <TripHero
        variant="tour"
        title={itinerary.title}
        subtitle={tour.location}
        status={resort && <ResortStatus resort={resort} />}
        rating={resort && <ResortRating resort={resort} />}
        isFavorite={favorite.isFavorite}
        onToggleFavorite={favorite.toggle}
        totalLabel={base}
        totalNote="за 1 человека"
      />
      <div className={styles.sections}>
        <TourOverviewSection overview={overview} />
        {offers.length > 0 && (
          <TourExtrasSection
            offers={offers}
            quantities={quantities}
            onAdd={(id) => setQuantity(id, 1)}
          />
        )}
        {resort && <ResortTrailSection resort={resort} />}
        {resort && <ResortInfrastructureSection resort={resort} />}
        {reviews.length > 0 && <TourReviewsSection reviews={reviews} />}
        {selected.length > 0 && (
          <section
            className={styles.configure}
            aria-label="Переход в конфигуратор"
          >
            <div>
              <span className={styles.quote}>
                от <strong>{base}</strong>
              </span>
              <p>за 1 человека без допуслуг</p>
            </div>
            <Button
              text="В конфигуратор"
              icon={<ArrowRightIcon aria-hidden="true" />}
              iconVariant="plain"
              variant="solid"
              onClick={openConstructor}
            />
          </section>
        )}
        <TripCostSummary
          costs={costs}
          totalLabel={`от ${formatPrice(total)}`}
          totalNote="за 1 человека"
          renderRowControls={({ addon }) => {
            if (!addon) return null;
            return (
              <QuantityStepper
                value={addon.quantity}
                onChange={(quantity) => setQuantity(addon.id, quantity)}
                decrementLabel={`Уменьшить количество: ${addon.label}`}
                incrementLabel={`Увеличить количество: ${addon.label}`}
              />
            );
          }}
        />
      </div>
    </div>
  );
}

export default function TourDetailsPage() {
  const { tourId } = useParams();
  const tour = findTour(tourId);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tourId]);

  if (!tour) {
    return (
      <div className={styles.page}>
        <BackLink
          text="На главную"
          to="/"
        />
        <h1 className={styles.missing}>Тур не найден</h1>
      </div>
    );
  }
  return (
    <TourView
      key={tourId}
      tour={tour}
    />
  );
}
