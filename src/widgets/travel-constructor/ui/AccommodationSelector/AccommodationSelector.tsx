import { useMemo, useState } from 'react';
import { SearchInput } from '@/shared/ui/base/SearchInput';
import { AccommodationMapModal } from '@/widgets/travel-constructor/ui/AccommodationMapModal';
import {
  MOCK_ACCOMMODATIONS,
  type Accommodation,
  type AccommodationOption,
} from '@/entities/accommodation';
import {
  MAX_PRICE,
  RATING_FILTERS,
  type RatingFilter,
} from '@/widgets/travel-constructor/config/accommodationFilters';
import {
  MOCK_TOTAL_ACCOMMODATION_COUNT,
  UNAVAILABLE_SEARCH_QUERIES,
} from '@/widgets/travel-constructor/mocks/accommodationScenarios';
import { AccommodationFilters } from './AccommodationFilters';
import { AccommodationResults } from './AccommodationResults';
import styles from './AccommodationSelector.module.scss';

interface AccommodationSelectorProps {
  selectedAccommodationId: string | null;
  onSelect: (accommodation: Accommodation) => void;
  options?: readonly AccommodationOption[];
  isMapAvailable?: boolean;
  availabilityStatus?: 'available' | 'no-rooms';
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

export function AccommodationSelector({
  selectedAccommodationId,
  onSelect,
  options = MOCK_ACCOMMODATIONS,
  isMapAvailable = true,
  availabilityStatus = 'available',
}: AccommodationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(RATING_FILTERS[0]);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [showAdditionalAmenities, setShowAdditionalAmenities] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ru-RU');
  const hasNoAvailableRooms = availabilityStatus === 'no-rooms'
    || UNAVAILABLE_SEARCH_QUERIES.some(
      (query) => normalizedQuery.includes(query),
    );

  const filteredAccommodations = useMemo(() => {
    if (hasNoAvailableRooms) {
      return [];
    }

    return options.filter((option) => {
      const matchesSearch = !normalizedQuery
        || option.name.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
        || option.location.toLocaleLowerCase('ru-RU').includes(normalizedQuery);
      const matchesPrice = option.pricePerNight >= minPrice
        && option.pricePerNight <= maxPrice;
      const matchesLocation = locationFilters.length === 0
        || locationFilters.every((filter) => option.locations.includes(filter));
      const matchesAmenities = amenityFilters.length === 0
        || amenityFilters.every((filter) => option.amenities.includes(filter));
      const matchesExpandedFilters = expandedFilters.length === 0
        || expandedFilters.every((filter) => option.expandedFilters.includes(filter));
      const matchesRating = ratingFilter === RATING_FILTERS[0]
        || (ratingFilter === '4,5 и выше' && option.rating >= 4.5)
        || (ratingFilter === '4 и выше' && option.rating >= 4)
        || (ratingFilter === '3 и выше' && option.rating >= 3);

      return matchesSearch
        && matchesPrice
        && matchesLocation
        && matchesAmenities
        && matchesExpandedFilters
        && matchesRating;
    });
  }, [
    amenityFilters,
    expandedFilters,
    hasNoAvailableRooms,
    locationFilters,
    maxPrice,
    minPrice,
    normalizedQuery,
    options,
    ratingFilter,
  ]);

  const hasActiveFilters = Boolean(
    normalizedQuery
    || minPrice > 0
    || maxPrice < MAX_PRICE
    || locationFilters.length
    || amenityFilters.length
    || expandedFilters.length
    || ratingFilter !== RATING_FILTERS[0],
  );
  const resultCount = hasActiveFilters
    ? filteredAccommodations.length
    : MOCK_TOTAL_ACCOMMODATION_COUNT;

  return (
    <div className={styles.selector}>
      <SearchInput
        ariaLabel="Поиск места проживания"
        id="accommodation-search"
        name="accommodation-search"
        onChange={setSearchQuery}
        placeholder="Начните вводить название, а мы подскажем"
        value={searchQuery}
      />

      <AccommodationFilters
        amenityFilters={amenityFilters}
        expandedFilters={expandedFilters}
        locationFilters={locationFilters}
        maxPrice={maxPrice}
        minPrice={minPrice}
        onAmenityToggle={(option) => setAmenityFilters((filters) => toggleValue(filters, option))}
        onExpandedFilterToggle={(option) => setExpandedFilters((filters) => toggleValue(filters, option))}
        onLocationToggle={(option) => setLocationFilters((filters) => toggleValue(filters, option))}
        onMaxPriceChange={setMaxPrice}
        onMinPriceChange={setMinPrice}
        onRatingChange={setRatingFilter}
        onToggleAdditionalAmenities={() => setShowAdditionalAmenities((isShown) => !isShown)}
        ratingFilter={ratingFilter}
        showAdditionalAmenities={showAdditionalAmenities}
      />

      <AccommodationResults
        accommodations={filteredAccommodations}
        hasActiveFilters={hasActiveFilters}
        hasNoAvailableRooms={hasNoAvailableRooms}
        onOpenMap={() => setIsMapOpen(true)}
        onSelect={onSelect}
        resultCount={resultCount}
        selectedAccommodationId={selectedAccommodationId}
      />

      <AccommodationMapModal
        isMapAvailable={isMapAvailable}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />
    </div>
  );
}
