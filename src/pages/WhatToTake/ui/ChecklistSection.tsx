import { Icon } from '@iconify/react';

import Checkbox from '@/shared/ui/base/Checkbox';

import type { ChecklistItem, ChecklistSection as ChecklistSectionData } from '../data';

import style from './ChecklistSection.module.scss';

interface ChecklistSectionProps {
  section: ChecklistSectionData;
  checkedItems: ReadonlySet<string>;
  onItemChange: (itemId: string, checked: boolean) => void;
}

interface ChecklistItemRowProps {
  item: ChecklistItem;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ChecklistItemRow({ item, checked, onChange }: ChecklistItemRowProps) {
  return (
    <div
      className={style.item}
      data-checked={checked}
    >
      <Checkbox
        checked={checked}
        aria-label={item.label}
        onChange={onChange}
      />
      <button
        type="button"
        className={style.itemLabel}
        onClick={() => onChange(!checked)}
      >
        {item.label}
      </button>
    </div>
  );
}

export function ChecklistSection({ section, checkedItems, onItemChange }: ChecklistSectionProps) {
  const sectionItems = section.groups.flatMap((group) => group.items);
  const checkedCount = sectionItems.filter((item) => checkedItems.has(item.id)).length;

  return (
    <article className={style.card}>
      <div className={style.header}>
        <h2 className={style.title}>
          <Icon icon={section.icon} />
          {section.title}
        </h2>
        <span className={style.counter}>
          {checkedCount}/{sectionItems.length}
        </span>
      </div>

      {section.intro && <p className={style.intro}>{section.intro}</p>}

      {section.groups.map((group, groupIndex) => (
        <div
          key={`${section.id}-${group.title ?? groupIndex}`}
          className={style.group}
        >
          {group.title && <h3 className={style.groupTitle}>{group.title}</h3>}
          {group.description && <p className={style.groupDescription}>{group.description}</p>}
          <div className={style.itemsGrid}>
            {group.items.map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                checked={checkedItems.has(item.id)}
                onChange={(checked) => onItemChange(item.id, checked)}
              />
            ))}
          </div>
        </div>
      ))}

      {section.tip && (
        <div className={style.tip}>
          <Icon icon="solar:info-circle-bold" />
          <p>{section.tip}</p>
        </div>
      )}
      {section.afterword && <p className={style.afterword}>{section.afterword}</p>}
    </article>
  );
}
