import { AlertIcon } from '@/assets/icons/constructor';
import { ResortCard, type Resort } from '@/entities/resort';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { Button } from '@/shared/ui/Button';
import { CardList } from '@/shared/ui/CardList';

import styles from './ResortsList.module.scss';

interface ResortsListProps {
  resorts: readonly Resort[];
  selectedResortId?: string;
  onSelect: (resort: Resort) => void;
  onDetails: (resort: Resort) => void;
  onResetFilters: () => void;
}

export function ResortsList({
  resorts,
  selectedResortId,
  onSelect,
  onDetails,
  onResetFilters,
}: Readonly<ResortsListProps>) {
  return (
    <CardList>
      {resorts.length ? (
        resorts.map((resort) => (
          <ResortCard
            key={resort.id}
            resort={resort}
            isSelected={resort.id === selectedResortId}
            onSelect={onSelect}
            onDetails={onDetails}
          />
        ))
      ) : (
        <div className={styles.empty}>
          <EmptyState
            icon={<AlertIcon aria-hidden="true" />}
            title="Курорты не найдены"
            description="Попробуйте изменить условия поиска."
          />
          <Button
            text="Сбросить фильтры"
            variant="light"
            onClick={onResetFilters}
          />
        </div>
      )}
    </CardList>
  );
}
