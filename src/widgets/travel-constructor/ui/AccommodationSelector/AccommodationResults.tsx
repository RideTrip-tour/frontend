import { EmptyState } from '@/shared/ui/base/EmptyState';
import { AlertIcon, SearchInfoIcon } from '@/assets/icons/constructor';
import type { AccommodationOption } from '@/entities/accommodation';
import { formatResultCount } from '@/widgets/travel-constructor/lib/formatters';
import { AccommodationCard } from './AccommodationCard';
import styles from './AccommodationSelector.module.scss';

interface AccommodationResultsProps {
  accommodations: AccommodationOption[];
  selectedAccommodationId: string | null;
  hasNoAvailableRooms: boolean;
  hasActiveFilters: boolean;
  resultCount: number;
  onSelect: (accommodation: AccommodationOption) => void;
  onOpenMap: () => void;
}

export function AccommodationResults({
  accommodations,
  selectedAccommodationId,
  hasNoAvailableRooms,
  hasActiveFilters,
  resultCount,
  onSelect,
  onOpenMap,
}: AccommodationResultsProps) {
  return (
    <>
      <div className={`${styles.resultsHeader} ${accommodations.length === 0 ? styles.resultsHeaderEmpty : ''}`}>
        {accommodations.length > 0 && (
          <h3 className={styles.resultsTitle}>
            Найдено {hasActiveFilters ? formatResultCount(resultCount) : `${resultCount} отелей`}
          </h3>
        )}
        <button
          className={styles.mapButton}
          onClick={onOpenMap}
          type="button"
        >
          <span>{hasNoAvailableRooms ? 'Отели на карте' : 'Показать на карте'}</span>
          <span aria-hidden="true" className={styles.mapArrow}>›</span>
        </button>
      </div>

      {accommodations.length > 0 ? (
        <div className={styles.resultsList}>
          {accommodations.map((option) => (
            <AccommodationCard
              isSelected={selectedAccommodationId === option.id}
              key={option.id}
              onSelect={onSelect}
              option={option}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyStateWrapper}>
          <EmptyState
            description={hasNoAvailableRooms
              ? 'Попробуйте другие даты или другой вариант размещения'
              : 'Проверьте написание или попробуйте изменить фильтры.'}
            icon={hasNoAvailableRooms
              ? <AlertIcon aria-hidden="true" />
              : <SearchInfoIcon aria-hidden="true" />}
            title={hasNoAvailableRooms ? 'Увы, всё занято' : 'Нет подходящих отелей'}
          />
        </div>
      )}
    </>
  );
}
