import { Icon } from '@iconify/react';
import { useState } from 'react';

import Modal from '@/shared/ui/base/Modal';
import { Button } from '@/shared/ui/Button';
import { FilterButton, FilterSelect, FiltersToolbar, SortSelect } from '@/shared/ui/FiltersToolbar';
import { formatResultCount } from '@/widgets/travel-constructor';

import type { ResortFilterValues, ResortSort } from '../../model/useResorts';

import styles from './ResortFilters.module.scss';

interface ResortFiltersProps {
  filters: ResortFilterValues;
  onFilterChange: <K extends keyof ResortFilterValues>(
    key: K,
    value: ResortFilterValues[K],
  ) => void;
  countries: readonly string[];
  sort: ResortSort;
  onSortChange: (sort: ResortSort) => void;
  onReset: () => void;
  totalCount: number;
}

type ResortFilterControlsProps = Pick<
  ResortFiltersProps,
  'filters' | 'onFilterChange' | 'countries'
>;

function ResortFilterControls({
  filters,
  onFilterChange,
  countries,
}: Readonly<ResortFilterControlsProps>) {
  return (
    <>
      <FilterSelect
        aria-label="Цена ски-пасса"
        value={filters.maxPrice ?? ''}
        onChange={(event) =>
          onFilterChange('maxPrice', event.target.value ? Number(event.target.value) : null)
        }
      >
        <option value="">Цена</option>
        <option value="2000">До 2 000 ₽</option>
        <option value="3000">До 3 000 ₽</option>
        <option value="4000">До 4 000 ₽</option>
      </FilterSelect>
      <FilterSelect
        aria-label="Статус работы курорта"
        value={filters.availability}
        onChange={(event) =>
          onFilterChange('availability', event.target.value as ResortFilterValues['availability'])
        }
      >
        <option value="all">Статус работы</option>
        <option value="open">Открыты сейчас</option>
        <option value="closed">Закрыты</option>
      </FilterSelect>
      <FilterSelect
        aria-label="Уровень катания"
        value={filters.difficulty}
        onChange={(event) =>
          onFilterChange('difficulty', event.target.value as ResortFilterValues['difficulty'])
        }
      >
        <option value="all">Уровень катания</option>
        <option value="beginner">Для новичков</option>
        <option value="advanced">Для опытных</option>
      </FilterSelect>
      <FilterSelect
        aria-label="Страна"
        value={filters.country}
        onChange={(event) => onFilterChange('country', event.target.value)}
      >
        <option value="">Все страны</option>
        {countries.map((country) => (
          <option
            key={country}
            value={country}
          >
            {country}
          </option>
        ))}
      </FilterSelect>
    </>
  );
}

export function ResortFilters({
  filters,
  onFilterChange,
  countries,
  sort,
  onSortChange,
  onReset,
  totalCount,
}: Readonly<ResortFiltersProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FiltersToolbar
        className={styles.toolbar}
        sortControl={
          <SortSelect
            aria-label="Сортировка вариантов"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ResortSort)}
          >
            <option value="recommended">Сначала лучшие</option>
            <option value="price">Сначала дешевле</option>
            <option value="rating">По рейтингу</option>
          </SortSelect>
        }
      >
        <FilterButton
          variant="primary"
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          <Icon
            aria-hidden="true"
            className={styles.filterIcon}
            icon="mage:filter-fill"
          />
          Фильтры
        </FilterButton>
        <ResortFilterControls
          filters={filters}
          onFilterChange={onFilterChange}
          countries={countries}
        />
      </FiltersToolbar>
      <Modal
        className={styles.modal}
        isOpen={isOpen}
        title="Фильтры курортов"
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.modalControls}>
          <ResortFilterControls
            filters={filters}
            onFilterChange={onFilterChange}
            countries={countries}
          />
        </div>
        <div className={styles.actions}>
          <Button
            text="Сбросить"
            variant="light"
            onClick={onReset}
          />
          <Button
            text={`Показать ${formatResultCount(totalCount)}`}
            variant="solid"
            onClick={() => setIsOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
