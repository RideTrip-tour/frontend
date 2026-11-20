import { useMemo, useState } from 'react';

import { MOCK_RESORTS, type Resort } from '@/entities/resort';

export interface ResortFilterValues {
  maxPrice: number | null;
  availability: 'all' | 'open' | 'closed';
  difficulty: 'all' | 'beginner' | 'advanced';
  country: string;
}

export type ResortSort = 'recommended' | 'price' | 'rating';

const INITIAL_FILTERS: ResortFilterValues = {
  maxPrice: null,
  availability: 'all',
  difficulty: 'all',
  country: '',
};

export function filterResorts(
  resorts: readonly Resort[],
  filters: ResortFilterValues,
  sort: ResortSort,
): Resort[] {
  const result = resorts.filter((resort) => {
    if (filters.maxPrice !== null && resort.pricePerDay > filters.maxPrice) return false;
    if (filters.availability === 'open' && !resort.isOpen) return false;
    if (filters.availability === 'closed' && resort.isOpen) return false;
    if (filters.difficulty === 'beginner' && !resort.difficulties.includes('green')) return false;
    if (filters.difficulty === 'advanced' && !resort.difficulties.includes('black')) return false;
    return !filters.country || resort.country === filters.country;
  });

  if (sort === 'price') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  return result;
}

export function useResorts() {
  const [filters, setFilters] = useState<ResortFilterValues>(INITIAL_FILTERS);
  const [sort, setSort] = useState<ResortSort>('recommended');
  const resorts = useMemo(() => filterResorts(MOCK_RESORTS, filters, sort), [filters, sort]);
  const countries = useMemo(() => [...new Set(MOCK_RESORTS.map((resort) => resort.country))], []);

  const setFilter = <K extends keyof ResortFilterValues>(key: K, value: ResortFilterValues[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return {
    resorts,
    totalCount: resorts.length,
    countries,
    filters,
    setFilter,
    resetFilters: () => setFilters(INITIAL_FILTERS),
    sort,
    setSort,
  };
}
