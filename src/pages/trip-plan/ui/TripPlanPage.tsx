import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
  DownloadIcon,
  PlainIcon,
  HotelIcon,
  SaveIcon,
  ShareIcon,
  TaxiIcon,
} from '@/assets/icons/constructor';
import {
  getTripPlanContextKey,
  TripPlanCostSummary,
  TripPlanHero,
  type TripPlanInfoAction,
  TripPlanInfoSection,
  TripPlanTravelersSection,
  useTripPlan,
} from '@/entities/trip-plan';
import { BackLink } from '@/shared/ui/base';
import { Button } from '@/shared/ui/Button';
import { getPartnerOffersReturnPath, useConstructor } from '@/widgets/travel-constructor';

import { formatTripPlanForSharing } from '../lib/formatTripPlanForSharing';
import { buildTripPlan } from '../model/buildTripPlan';
import type { TripPlanEditTarget, TripPlanServiceData } from '../model/types';

import styles from './TripPlanPage.module.scss';

export default function TripPlanPage() {
  const trip = useConstructor();
  const accommodation = useTripPlan((state) => state.accommodation);
  const location = useLocation();
  const navigate = useNavigate();
  const sharing = useRef(false);
  const contextKey = getTripPlanContextKey(trip);
  const selection = accommodation?.contextKey === contextKey ? accommodation : null;
  const plan = useMemo(() => buildTripPlan(trip, selection?.offer ?? null), [trip, selection]);
  const offersPath = getPartnerOffersReturnPath(location.state);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const edit = (selectorId?: TripPlanEditTarget) => {
    if (selectorId === 'offers') {
      navigate(offersPath);
      return;
    }
    trip.setActiveSelectorId(selectorId ?? null);
    navigate('/trip-builder', {
      state: { partnerOffersReturnTo: offersPath },
    });
  };

  const print = () => {
    const previousTitle = document.title;
    try {
      document.title = `План поездки — ${plan.title}`;
      window.print();
    } catch {
      // Printing may be unavailable in the current browser.
    } finally {
      document.title = previousTitle;
    }
  };

  const share = async () => {
    if (sharing.current) return;
    sharing.current = true;
    const data = { title: `План поездки — ${plan.title}`, text: formatTripPlanForSharing(plan) };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.text);
      }
    } catch {
      // Sharing can be cancelled or clipboard access denied.
    } finally {
      sharing.current = false;
    }
  };

  const serviceAction = (service: TripPlanServiceData): TripPlanInfoAction =>
    service.bookingUrl
      ? { label: service.actionLabel, href: service.bookingUrl }
      : { label: service.actionLabel, disabled: true };

  return (
    <div className={styles.page}>
      <BackLink
        className={styles.back}
        onClick={() => navigate(offersPath)}
        text="К подобранным вариантам"
      />
      <TripPlanHero
        title={plan.title}
        subtitle={plan.subtitle}
        badges={plan.badges}
        totalLabel={plan.totalLabel}
        totalNote={plan.totalNote}
      />
      <div
        className={styles.actions}
        aria-label="Действия с планом поездки"
      >
        <Button
          className={styles.actionButton}
          icon={<SaveIcon aria-hidden="true" />}
          iconPosition="left"
          iconVariant="plain"
          text="Сохранить"
          variant="light"
        />
        <Button
          className={styles.actionButton}
          icon={<DownloadIcon aria-hidden="true" />}
          iconPosition="left"
          iconVariant="plain"
          text="Скачать PDF"
          variant="light"
          onClick={print}
        />
        <Button
          className={styles.actionButton}
          icon={<ShareIcon aria-hidden="true" />}
          iconPosition="left"
          iconVariant="plain"
          text="Поделиться"
          variant="light"
          onClick={() => void share()}
        />
        <Button
          className={styles.actionButton}
          icon="solar:pen-bold"
          iconPosition="left"
          iconVariant="plain"
          text="Изменить параметры"
          variant="light"
          onClick={() => edit()}
        />
      </div>
      <div className={styles.sections}>
        <TripPlanInfoSection
          title="Билеты"
          icon={<PlainIcon />}
          fields={plan.tickets.fields}
          footer={plan.tickets.footer}
          amenities={plan.tickets.amenities}
          action={serviceAction(plan.tickets)}
        />
        <TripPlanInfoSection
          title="Проживание"
          icon={<HotelIcon />}
          fields={plan.accommodation.fields}
          footer={plan.accommodation.footer}
          footerPhone={plan.accommodation.footerPhone}
          amenities={plan.accommodation.amenities}
          action={serviceAction(plan.accommodation)}
        />
        <TripPlanInfoSection
          title="Трансфер"
          icon={<TaxiIcon />}
          fields={plan.transfer.fields}
          footer={plan.transfer.footer}
          amenities={plan.transfer.amenities}
          action={serviceAction(plan.transfer)}
        />
        <TripPlanTravelersSection
          travelers={plan.travelers}
          additional={plan.additional}
          onEdit={() => edit('people')}
        />
        <TripPlanCostSummary
          costs={plan.costs}
          totalLabel={plan.perPersonTotalLabel}
          totalNote="за 1 человека"
        />
      </div>
    </div>
  );
}
