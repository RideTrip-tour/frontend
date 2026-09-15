import { useState } from 'react';
import clsx from 'clsx';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { SearchInput } from '@/shared/ui/base/SearchInput';
import { SearchInfoIcon } from '@/assets/icons/constructor';
import {
  ADDITIONAL_ACTIVITIES,
  LIFT_TYPES,
  PRIMARY_ACTIVITIES,
} from '@/widgets/travel-constructor/config/activityOptions';
import styles from './ActivitySelector.module.scss';

interface ActivitySelectorProps {
  selectedActivities: string[];
  selectedLiftTypes: string[];
  onActivitiesChange: (activities: string[]) => void;
  onLiftTypesChange: (liftTypes: string[]) => void;
}

interface OptionListProps {
  name: string;
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

function OptionList({
  name,
  options,
  selectedOptions,
  onChange,
}: OptionListProps) {
  const toggleOption = (option: string) => {
    const nextOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];

    onChange(nextOptions);
  };

  return (
    <div className={styles.optionList}>
      {options.map((option) => {
        const inputId = `${name}-${option}`
          .toLowerCase()
          .replace(/[^a-zа-яё0-9]+/gi, '-');

        return (
          <label className={styles.option} htmlFor={inputId} key={option}>
            <input
              checked={selectedOptions.includes(option)}
              className={styles.checkbox}
              id={inputId}
              name={name}
              onChange={() => toggleOption(option)}
              type="checkbox"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

export function ActivitySelector({
  selectedActivities,
  selectedLiftTypes,
  onActivitiesChange,
  onLiftTypesChange,
}: ActivitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllActivities, setShowAllActivities] = useState(false);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ru-RU');
  const allActivities = [...PRIMARY_ACTIVITIES, ...ADDITIONAL_ACTIVITIES];
  const visibleActivities = normalizedQuery || showAllActivities
    ? allActivities
    : PRIMARY_ACTIVITIES;

  const filteredActivities = visibleActivities.filter((activity) =>
    activity.toLocaleLowerCase('ru-RU').includes(normalizedQuery),
  );

  const filteredLiftTypes = LIFT_TYPES.filter((liftType) =>
    liftType.toLocaleLowerCase('ru-RU').includes(normalizedQuery),
  );

  const hasResults = filteredActivities.length > 0 || filteredLiftTypes.length > 0;

  return (
    <div className={styles.selector}>
      <SearchInput
        ariaLabel="Поиск активности или типа подъёмника"
        id="activity-search"
        name="activity-search"
        onChange={setSearchQuery}
        placeholder="Начните вводить название, а мы подскажем"
        value={searchQuery}
      />

      {hasResults ? (
        <div className={styles.columns}>
          <section className={styles.group} aria-labelledby="activity-types-title">
            <h3 className={styles.groupTitle} id="activity-types-title">
              Виды активностей
            </h3>

            <OptionList
              name="activity-type"
              onChange={onActivitiesChange}
              options={filteredActivities}
              selectedOptions={selectedActivities}
            />

            {!normalizedQuery && (
              <button
                aria-expanded={showAllActivities}
                className={styles.showMoreButton}
                onClick={() => setShowAllActivities((isShown) => !isShown)}
                type="button"
              >
                <span>{showAllActivities ? 'Скрыть' : 'Смотреть ещё'}</span>
                <span
                  aria-hidden="true"
                  className={clsx(styles.chevron, {
                    [styles.chevronUp]: showAllActivities,
                  })}
                />
              </button>
            )}
          </section>

          <section className={styles.group} aria-labelledby="lift-types-title">
            <h3 className={styles.groupTitle} id="lift-types-title">
              Виды подъёмников
            </h3>

            <OptionList
              name="lift-type"
              onChange={onLiftTypesChange}
              options={filteredLiftTypes}
              selectedOptions={selectedLiftTypes}
            />
          </section>
        </div>
      ) : (
        <div className={styles.emptyStateWrapper}>
          <EmptyState
            description="Проверьте написание или попробуйте изменить запрос."
            icon={<SearchInfoIcon aria-hidden="true" />}
            title="Ничего не найдено"
          />
        </div>
      )}
    </div>
  );
}
