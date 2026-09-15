import clsx from 'clsx';
import {
  EXPANDED_FILTER_GROUPS,
  LOCATION_FILTERS,
  MAX_PRICE,
  PRICE_STEP,
  PRIMARY_AMENITIES,
  RATING_FILTERS,
  type RatingFilter,
} from '@/widgets/travel-constructor/config/accommodationFilters';
import { priceFormatter } from '@/widgets/travel-constructor/lib/formatters';
import { FilterGroup } from './FilterGroup';
import styles from './AccommodationSelector.module.scss';

interface AccommodationFiltersProps {
  minPrice: number;
  maxPrice: number;
  locationFilters: string[];
  ratingFilter: RatingFilter;
  amenityFilters: string[];
  expandedFilters: string[];
  showAdditionalAmenities: boolean;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onLocationToggle: (value: string) => void;
  onRatingChange: (value: RatingFilter) => void;
  onAmenityToggle: (value: string) => void;
  onExpandedFilterToggle: (value: string) => void;
  onToggleAdditionalAmenities: () => void;
}

export function AccommodationFilters({
  minPrice,
  maxPrice,
  locationFilters,
  ratingFilter,
  amenityFilters,
  expandedFilters,
  showAdditionalAmenities,
  onMinPriceChange,
  onMaxPriceChange,
  onLocationToggle,
  onRatingChange,
  onAmenityToggle,
  onExpandedFilterToggle,
  onToggleAdditionalAmenities,
}: AccommodationFiltersProps) {
  return (
    <>
      <section className={styles.priceSection} aria-labelledby="price-title">
        <h3 className={styles.filterTitle} id="price-title">Цена за ночь</h3>
        <div className={styles.priceValues}>
          <span>{priceFormatter.format(minPrice)} ₽</span>
          <span>
            {priceFormatter.format(maxPrice)}{maxPrice === MAX_PRICE ? '+' : ''} ₽
          </span>
        </div>
        <div className={styles.range}>
          <div
            className={styles.rangeTrack}
            style={{
              left: `${(minPrice / MAX_PRICE) * 100}%`,
              right: `${100 - (maxPrice / MAX_PRICE) * 100}%`,
            }}
          />
          <input
            aria-label="Минимальная цена за ночь"
            className={styles.rangeInput}
            max={MAX_PRICE}
            min="0"
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              onMinPriceChange(Math.min(nextValue, maxPrice - PRICE_STEP));
            }}
            step={PRICE_STEP}
            type="range"
            value={minPrice}
          />
          <input
            aria-label="Максимальная цена за ночь"
            className={styles.rangeInput}
            max={MAX_PRICE}
            min="0"
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              onMaxPriceChange(Math.max(nextValue, minPrice + PRICE_STEP));
            }}
            step={PRICE_STEP}
            type="range"
            value={maxPrice}
          />
        </div>
      </section>

      <FilterGroup
        onToggle={onLocationToggle}
        options={LOCATION_FILTERS}
        selectedOptions={locationFilters}
        title="Местоположение"
      />

      <section className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Рейтинг</h3>
        <div className={styles.chips}>
          {RATING_FILTERS.map((option) => (
            <button
              aria-pressed={ratingFilter === option}
              className={clsx(styles.chip, {
                [styles.chipSelected]: ratingFilter === option,
              })}
              key={option}
              onClick={() => onRatingChange(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <FilterGroup
        onToggle={onAmenityToggle}
        options={PRIMARY_AMENITIES}
        selectedOptions={amenityFilters}
        title="Общие удобства"
      />

      {showAdditionalAmenities && (
        <div className={styles.expandedFilters}>
          {EXPANDED_FILTER_GROUPS.map((group) => (
            <FilterGroup
              key={group.title}
              onToggle={onExpandedFilterToggle}
              options={group.options}
              selectedOptions={expandedFilters}
              title={group.title}
            />
          ))}
        </div>
      )}

      <button
        aria-expanded={showAdditionalAmenities}
        className={styles.moreButton}
        onClick={onToggleAdditionalAmenities}
        type="button"
      >
        <span>{showAdditionalAmenities ? 'Скрыть удобства' : 'Ещё удобства'}</span>
        <span
          aria-hidden="true"
          className={clsx(styles.chevron, {
            [styles.chevronUp]: showAdditionalAmenities,
          })}
        />
      </button>
    </>
  );
}
