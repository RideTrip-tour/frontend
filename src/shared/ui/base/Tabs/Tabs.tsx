import clsx from 'clsx';

import style from './tabs.module.scss';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  countVariant?: 'blue' | 'orange' | 'gray';
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className = '' }: TabsProps) => (
  <div
    className={clsx(style.tabs, className)}
    role="tablist"
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls={`panel-${tab.id}`}
        id={`tab-${tab.id}`}
        className={clsx(style.tabs__item, {
          [style['tabs__item--active']]: activeTab === tab.id,
        })}
        onClick={() => onChange(tab.id)}
        type="button"
      >
        <span className={style.tabs__label}>{tab.label}</span>
        {tab.count !== undefined && tab.count > 0 && (
          <span className={clsx(style.tabs__count, style[`tabs__count--${tab.countVariant}`])}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);
