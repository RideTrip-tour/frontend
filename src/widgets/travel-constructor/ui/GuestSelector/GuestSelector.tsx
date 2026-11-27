import { useState } from 'react';

import { QuantityStepper } from '@/shared/ui/QuantityStepper';
import type { ChildAgeGroup, GuestSelection } from '@/widgets/travel-constructor/model/types';

import styles from './GuestSelector.module.scss';

const AGE_GROUPS: ChildAgeGroup[] = ['До 3-х лет', '4-12 лет', '13-17 лет'];

const MAX_ADULTS = 8;
const MAX_CHILDREN = 8;

interface GuestSelectorProps {
  value: GuestSelection | null;
  onChange: (selection: GuestSelection) => void;
}

function createAgeGroups(children: number, selectedGroups: Array<ChildAgeGroup | null> = []) {
  return Array.from({ length: children }, (_, index) => selectedGroups[index] ?? null);
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const [adults, setAdults] = useState(value?.adults ?? 0);
  const [children, setChildren] = useState(value?.children ?? 0);
  const [childAgeGroups, setChildAgeGroups] = useState<Array<ChildAgeGroup | null>>(() =>
    createAgeGroups(value?.children ?? 0, value?.childAgeGroups),
  );

  const updateSelection = (
    nextAdults: number,
    nextChildren: number,
    nextAgeGroups: Array<ChildAgeGroup | null>,
  ) => {
    onChange({
      adults: nextAdults,
      children: nextChildren,
      childAgeGroups: nextAgeGroups,
    });
  };

  const changeAdults = (nextAdults: number) => {
    setAdults(nextAdults);
    updateSelection(nextAdults, children, childAgeGroups);
  };

  const changeChildren = (nextChildren: number) => {
    const nextAgeGroups = createAgeGroups(nextChildren, childAgeGroups);

    setChildren(nextChildren);
    setChildAgeGroups(nextAgeGroups);
    updateSelection(adults, nextChildren, nextAgeGroups);
  };

  const selectAgeGroup = (childIndex: number, ageGroup: ChildAgeGroup) => {
    const nextAgeGroups = childAgeGroups.map((currentAgeGroup, index) =>
      index === childIndex ? ageGroup : currentAgeGroup,
    );

    setChildAgeGroups(nextAgeGroups);
    updateSelection(adults, children, nextAgeGroups);
  };

  return (
    <div className={styles.selector}>
      <div className={styles.counterGroup}>
        <span className={styles.sectionTitle}>Взрослые</span>
        <QuantityStepper
          value={adults}
          min={1}
          max={MAX_ADULTS}
          decrementLabel="Уменьшить количество взрослых"
          incrementLabel="Увеличить количество взрослых"
          onChange={changeAdults}
        />
      </div>

      <div className={styles.counterGroup}>
        <h3 className={styles.sectionTitle}>Дети</h3>
        <QuantityStepper
          value={children}
          max={MAX_CHILDREN}
          decrementLabel="Уменьшить количество детей"
          incrementLabel="Увеличить количество детей"
          onChange={changeChildren}
        />
      </div>

      {children > 0 && (
        <section className={styles.ageSection}>
          <h3 className={styles.sectionTitle}>Возраст детей</h3>
          <div className={styles.ageGroups}>
            {childAgeGroups.map((selectedGroup, childIndex) => (
              <div
                aria-label={`Возраст ребёнка ${childIndex + 1}`}
                className={styles.ageGroup}
                key={`child-${childIndex}`}
                role="group"
              >
                {children > 1 && (
                  <span className={styles.childLabel}>Ребёнок {childIndex + 1}</span>
                )}
                <div className={styles.ageOptions}>
                  {AGE_GROUPS.map((ageGroup) => (
                    <button
                      aria-pressed={selectedGroup === ageGroup}
                      className={styles.ageOption}
                      data-selected={selectedGroup === ageGroup || undefined}
                      key={ageGroup}
                      onClick={() => selectAgeGroup(childIndex, ageGroup)}
                      type="button"
                    >
                      {ageGroup}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
