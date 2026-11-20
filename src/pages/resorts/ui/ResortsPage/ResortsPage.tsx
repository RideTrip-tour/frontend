import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { ResortDetailsModal, type Resort } from '@/entities/resort';
import BackLink from '@/shared/ui/base/BackLink';
import { useConstructor } from '@/widgets/travel-constructor';

import { useResorts } from '../../model/useResorts';
import { ResortFilters } from '../ResortFilters/ResortFilters';
import { ResortsHero } from '../ResortsHero/ResortsHero';
import { ResortsList } from '../ResortsList/ResortsList';

import styles from './ResortsPage.module.scss';

export default function ResortsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedResort = useConstructor((state) => state.selectedResort);
  const setSelectedResort = useConstructor((state) => state.setSelectedResort);
  const setActiveSelectorId = useConstructor((state) => state.setActiveSelectorId);
  const [detailsResort, setDetailsResort] = useState<Resort | null>(null);
  const { resorts, totalCount, countries, filters, setFilter, resetFilters, sort, setSort } =
    useResorts();

  const selectResort = (resort: Resort) => {
    if (!resort.isOpen) return;
    setSelectedResort(resort);
    setActiveSelectorId(null);
  };

  const openConstructor = () => {
    setActiveSelectorId(selectedResort ? null : 'to');
    navigate('..', { state: location.state });
  };

  return (
    <div className={styles.page}>
      <BackLink
        text="К конструктору"
        onClick={openConstructor}
      />
      <ResortsHero totalCount={totalCount} />
      <ResortFilters
        filters={filters}
        onFilterChange={setFilter}
        countries={countries}
        sort={sort}
        onSortChange={setSort}
        onReset={resetFilters}
        totalCount={totalCount}
      />
      <ResortsList
        resorts={resorts}
        selectedResortId={selectedResort?.id}
        onSelect={selectResort}
        onDetails={setDetailsResort}
        onResetFilters={resetFilters}
      />
      <p
        className={styles.visuallyHidden}
        role="status"
      >
        {selectedResort ? `Выбран курорт ${selectedResort.name}` : ''}
      </p>
      <ResortDetailsModal
        resort={detailsResort}
        isSelected={detailsResort?.id === selectedResort?.id}
        onClose={() => setDetailsResort(null)}
        onSelect={selectResort}
      />
    </div>
  );
}
