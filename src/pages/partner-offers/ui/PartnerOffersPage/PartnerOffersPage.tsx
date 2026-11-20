import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import type { PartnerOffer } from '@/entities/partner-offer';
import {
  getTripPlanContextKey,
  type TripPlanAccommodationOffer,
  useTripPlan,
} from '@/entities/trip-plan';
import { type ConstructorSelectionId, useConstructor } from '@/widgets/travel-constructor';

import { formatSearchDate } from '../../lib/formatters';
import { getPartnerOffersScenario } from '../../mocks/scenarios';
import { usePartnerOfferSearchFilters } from '../../model/searchFiltersStore';
import { usePartnerOffers } from '../../model/usePartnerOffers';
import { PartnerOfferFilters, type SortOption } from '../PartnerOfferFilters/PartnerOfferFilters';
import { PartnerOffersBookingNotice } from '../PartnerOffersBookingNotice/PartnerOffersBookingNotice';
import { PartnerOffersHelpers } from '../PartnerOffersHelpers/PartnerOffersHelpers';
import { PartnerOffersHero } from '../PartnerOffersHero/PartnerOffersHero';
import { PartnerOffersList } from '../PartnerOffersList/PartnerOffersList';
import {
  PartnerOffersNotices,
  type SuggestedFilter,
} from '../PartnerOffersNotices/PartnerOffersNotices';
import { PartnerOffersTripSummary } from '../PartnerOffersTripSummary/PartnerOffersTripSummary';

import styles from './PartnerOffersPage.module.scss';

function getOfferPriceBasis(priceLabel: string): TripPlanAccommodationOffer['priceBasis'] {
  switch (priceLabel) {
    case 'за человека':
      return 'person';
    case 'за ночь':
      return 'night';
    case 'за поездку':
      return 'trip';
    default:
      return 'unknown';
  }
}

export default function PartnerOffersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scenario = getPartnerOffersScenario(searchParams);
  const [sort, setSort] = useState<SortOption>('recommended');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const searchFilters = usePartnerOfferSearchFilters((state) => state.filters);
  const syncConstructorReset = usePartnerOfferSearchFilters((state) => state.syncConstructorReset);
  const syncConstructorTransfer = usePartnerOfferSearchFilters(
    (state) => state.syncConstructorTransfer,
  );
  const trip = useConstructor();
  const selectedAccommodation = useTripPlan((state) => state.accommodation);
  const selectAccommodation = useTripPlan((state) => state.selectAccommodation);
  const tripContextKey = getTripPlanContextKey(trip);
  const selectedOfferId =
    selectedAccommodation?.contextKey === tripContextKey ? selectedAccommodation.offer.id : null;
  const {
    departureDate,
    returnDate,
    transfer,
    resetRevision,
    setActiveSelectorId,
    proceedToTripPlan,
  } = trip;

  const constructorTransferRequired = transfer === null ? null : transfer.type === 'needed';
  useEffect(() => {
    syncConstructorReset(resetRevision);
    syncConstructorTransfer(constructorTransferRequired);
  }, [constructorTransferRequired, resetRevision, syncConstructorReset, syncConstructorTransfer]);

  const requestedFilters = useMemo(
    () => ({
      ...searchFilters,
      departureDate: formatSearchDate(departureDate),
      returnDate: formatSearchDate(returnDate),
    }),
    [searchFilters, departureDate, returnDate],
  );
  const result = usePartnerOffers({ scenario, requestedFilters });
  const offers = useMemo(() => {
    const sortedOffers = [...result.offers];

    if (sort === 'price') {
      return sortedOffers.sort((a, b) => a.price - b.price);
    }

    if (sort === 'rating') {
      return sortedOffers.sort((a, b) => b.rating - a.rating);
    }

    return sortedOffers;
  }, [result.offers, sort]);

  const toggleFavorite = (selected: PartnerOffer) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(selected.id)) {
        next.delete(selected.id);
      } else {
        next.add(selected.id);
      }
      return next;
    });
  };

  const openConstructor = (selectorId: ConstructorSelectionId | null = null) => {
    setActiveSelectorId(selectorId);
    navigate('..', {
      state: {
        partnerOffersReturnTo: location.pathname + location.search + location.hash,
      },
    });
  };

  const openPlan = () => {
    if (!proceedToTripPlan()) return;
    navigate('/trip-builder/plan', {
      state: { partnerOffersReturnTo: location.pathname + location.search + location.hash },
    });
  };

  const addOfferToPlan = (offer: PartnerOffer) => {
    const priceBasis = getOfferPriceBasis(offer.priceLabel);
    selectAccommodation(
      {
        id: offer.id,
        name: offer.name,
        location: offer.location,
        price: offer.price,
        priceBasis,
        priceLabel: offer.priceLabel,
        provider: offer.provider,
        amenities: offer.badges,
        accommodationType: offer.accommodationType,
        minRating: offer.minRating,
        rating: offer.rating,
        providerPhone: offer.providerPhone,
        checkInTime: offer.checkInTime,
        checkOutTime: offer.checkOutTime,
        bookingNumber: offer.bookingNumber,
        bookingUrl: offer.bookingUrl,
      },
      tripContextKey,
    );
  };

  const editSuggestedFilter = (filter: SuggestedFilter) => {
    if (filter === 'dates') {
      openConstructor('when');
    }
  };

  return (
    <main
      className={clsx(styles.page, result.status === 'error' && styles.errorPage)}
      aria-busy={result.status === 'loading'}
    >
      <PartnerOffersHero
        status={result.status}
        mode={result.mode}
        totalCount={result.totalCount}
        onBack={() => openConstructor()}
      />
      <PartnerOffersTripSummary
        status={result.status}
        trip={trip}
        onEdit={() => openConstructor()}
        onOpenPlan={openPlan}
        selectedAccommodationName={selectedOfferId ? selectedAccommodation?.offer.name : undefined}
      />
      <PartnerOffersNotices
        status={result.status}
        mode={result.mode}
        relaxations={result.relaxations}
        onRestoreFilter={result.restoreFilter}
        onRestoreAll={result.restoreAllFilters}
        onEditFilter={editSuggestedFilter}
      />
      <PartnerOfferFilters
        status={result.status}
        mode={result.mode}
        totalCount={result.totalCount}
        onSortChange={setSort}
        sort={sort}
      />
      <PartnerOffersBookingNotice
        status={result.status}
        mode={result.mode}
      />
      <PartnerOffersList
        status={result.status}
        offers={offers}
        favorites={favorites}
        onFavoriteToggle={toggleFavorite}
        onSelect={addOfferToPlan}
        selectedOfferId={selectedOfferId}
      />
      <PartnerOffersHelpers status={result.status} />
    </main>
  );
}
