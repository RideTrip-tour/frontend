import { useEffect, useMemo, useState } from 'react';

import { checklistSections, defaultCheckedItemIds } from '../data';

const STORAGE_KEY = 'ridetrip-what-to-take';

const itemIds = checklistSections.flatMap((section) =>
  section.groups.flatMap((group) => group.items.map((item) => item.id)),
);
const validItemIds = new Set(itemIds);

function getInitialCheckedItems(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultCheckedItemIds;

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string' && validItemIds.has(id))
      : defaultCheckedItemIds;
  } catch {
    return defaultCheckedItemIds;
  }
}

export function useChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>(getInitialCheckedItems);
  const checkedSet = useMemo(() => new Set(checkedItems), [checkedItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (itemId: string, checked: boolean) => {
    setCheckedItems((current) =>
      checked ? [...new Set([...current, itemId])] : current.filter((id) => id !== itemId),
    );
  };

  return {
    checkedItems,
    checkedSet,
    totalItems: itemIds.length,
    toggleItem,
    resetChecklist: () => setCheckedItems([]),
  };
}
