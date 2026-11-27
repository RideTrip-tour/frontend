import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';

import { TripSection } from '@/entities/trip';

import type { TripPlanField } from '../../model/presentation';

import styles from './TripPlanInfoSection.module.scss';

export type TripPlanInfoAction = { label: string } & (
  | { href: string; onClick?: never; disabled?: never }
  | { href?: never; onClick: () => void; disabled?: false }
  | { href?: never; onClick?: never; disabled: true }
);

export interface TripPlanInfoSectionProps {
  title: string;
  icon: ReactNode;
  fields: readonly TripPlanField[];
  footer?: string;
  footerPhone?: string;
  amenities?: readonly string[];
  action?: TripPlanInfoAction;
  className?: string;
}

export function TripPlanInfoSection({
  title,
  icon,
  fields,
  footer,
  footerPhone,
  amenities,
  action,
  className,
}: Readonly<TripPlanInfoSectionProps>) {
  const phone = footerPhone?.trim();
  const phoneHref = phone?.replace(/[^\d+]/g, '');
  const hasAmenities = Boolean(amenities?.length);

  return (
    <TripSection
      title={title}
      icon={icon}
      className={className}
    >
      <dl className={styles.details}>
        {fields.map((field) => (
          <div
            className={styles.field}
            key={field.label}
          >
            <dt>{field.label}</dt>
            <dd>
              <span className={styles.value}>{field.value}</span>
              {field.note && <span className={styles.note}>{field.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {(hasAmenities || footer || phone || action) && (
        <>
          <div
            className={styles.divider}
            aria-hidden="true"
          />
          <div className={styles.summary}>
            {amenities && amenities.length > 0 && (
              <ul
                className={styles.amenities}
                aria-label="Удобства проживания"
              >
                {amenities.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            )}
            {(footer || phone || action) && (
              <div className={styles.footer}>
                {(footer || phone) && (
                  <p>
                    {footer}
                    {footer && phone && (
                      <span
                        className={styles.contactDivider}
                        aria-hidden="true"
                      >
                        {' • '}
                      </span>
                    )}
                    {phone && (
                      <a
                        className={styles.phone}
                        href={`tel:${phoneHref}`}
                      >
                        {phone}
                      </a>
                    )}
                  </p>
                )}
                {action &&
                  (action.href !== undefined ? (
                    <a
                      className={styles.action}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {action.label}
                      <Icon
                        icon="material-symbols:arrow-forward-rounded"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <button
                      className={styles.action}
                      type="button"
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.label}
                      <Icon
                        icon="material-symbols:arrow-forward-rounded"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </TripSection>
  );
}
