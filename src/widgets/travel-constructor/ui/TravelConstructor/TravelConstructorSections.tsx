import type { ReactNode } from 'react';
import type { ConstructorSelectionId } from '@/widgets/travel-constructor/model/types';
import { ConstructorSelection } from '../ConstructorSelection';

export interface ConstructorItem {
  id: ConstructorSelectionId;
  icon: ReactNode;
  title: string;
  description: string;
  value: string | undefined;
  children: ReactNode;
  isComplete?: boolean;
}

interface TravelConstructorSectionsProps {
  items: ConstructorItem[];
  openItems: Record<ConstructorSelectionId, boolean>;
  onToggle: (id: ConstructorSelectionId) => void;
}

export function TravelConstructorSections({
  items,
  openItems,
  onToggle,
}: TravelConstructorSectionsProps) {
  return (
    <>
      {items.map((item) => (
        <ConstructorSelection
          description={item.description}
          icon={item.icon}
          isComplete={item.isComplete}
          isOpen={openItems[item.id]}
          key={item.id}
          onToggle={() => onToggle(item.id)}
          title={item.title}
          value={item.value}
        >
          {item.children}
        </ConstructorSelection>
      ))}
    </>
  );
}
