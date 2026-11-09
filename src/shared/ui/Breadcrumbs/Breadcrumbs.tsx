import { Fragment } from 'react';
import { Link } from 'react-router';

import { ChevronRightIcon } from '@/assets/icons';

import style from './breadcrumbs.module.scss';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  return (
    <nav
      aria-label="Навигация по сайту"
      className={[style.breadcrumbs, className].filter(Boolean).join(' ')}
    >
      <ol className={style.breadcrumbs__list}>
        {items.map(({ label, to }, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <Fragment key={`${label}-${index}`}>
              <li className={style.breadcrumbs__item}>
                {to && !isCurrent ? (
                  <Link
                    to={to}
                    className={style.breadcrumbs__link}
                  >
                    {label}
                  </Link>
                ) : (
                  <span
                    className={style.breadcrumbs__current}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {label}
                  </span>
                )}
              </li>
              {!isCurrent && (
                <li
                  className={style.breadcrumbs__separator}
                  aria-hidden="true"
                >
                  <ChevronRightIcon />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
