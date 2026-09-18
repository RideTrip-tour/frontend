import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import  type{ CartModalState } from '@/widgets/travel-constructor/model/cartModalTypes';
import { ConstructorCartModal } from '@/widgets/travel-constructor/ui/ConstructorCartModal';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { useConstructor } from '@/widgets/travel-constructor/model/constructorStore';
import {
  MOCK_SKI_LEVEL_PRICES,
  MOCK_TICKET_PRICE,
} from '@/widgets/travel-constructor/mocks/prices';
import {
  calculateActivityPrice,
  calculateAdditionalOptionsPrice,
} from '@/widgets/travel-constructor/lib/pricing';
import { formatGuestSummary } from '@/widgets/travel-constructor/lib/guestSummary';
import {
  formatCartDate,
  formatPrice,
} from '@/widgets/travel-constructor/lib/formatters';
import {
  DownloadIcon,
  SadfaceIcon,
  ResetIcon,
  SaveIcon,
  ShareIcon,
} from '@/assets/icons/constructor';
import style from './ConstructorCart.module.scss';
import { CartActions } from './CartActions';
import { CartItemHeader } from './CartItemHeader';
import { CartSummary } from './CartSummary';

interface PriceLineProps {
  price: number;
  note?: string;
}

function PriceLine({ price, note }: PriceLineProps) {
  return (
    <p className={style.itemPrice}>
      {price > 0 && <span>от</span>}
      <strong>{formatPrice(price)}</strong>
      {note && <span>{note}</span>}
    </p>
  );
}

export function ConstructorCart() {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const [modal, setModal] = useState<CartModalState>(null);
  const closeModal = () => setModal(null);
  const openAuth = (view: 'login' | 'register') => {
    closeModal();
    navigate(`/?auth=${view}`);
  };
  const {
    fromCity,
    fromCountry,
    toCity,
    toCountry,
    departureDate,
    returnDate,
    activities,
    liftTypes,
    accommodation,
    transfer,
    people,
    level,
    additional,
    activeSelectorId,
    clearActivities,
    clearAccommodation,
    clearAdditional,
    clearLevel,
    clearPeople,
    clearTickets,
    clearTransfer,
    resetConstructor: resetCart,
  } = useConstructor();

  const isSelectingFrom = activeSelectorId === 'from';
  const isSelectingTo = activeSelectorId === 'to';
  const isSelectingDates = activeSelectorId === 'when';
  const isSelectingTickets = isSelectingFrom || isSelectingTo || isSelectingDates;
  const isSelectingActivity = activeSelectorId === 'activity';
  const isSelectingAccommodation = activeSelectorId === 'hotel';
  const isSelectingTransfer = activeSelectorId === 'transfer';
  const isSelectingPeople = activeSelectorId === 'people';
  const isSelectingLevel = activeSelectorId === 'level';
  const isSelectingAdditional = activeSelectorId === 'additional';

  const origin = fromCity?.name ?? fromCountry?.name ?? null;
  const destination = toCity?.name ?? toCountry?.name ?? null;
  const hasTicketDetails = Boolean(
    origin || destination || departureDate || returnDate,
  );

  const route = origin || destination
    ? `${origin ?? 'Откуда'} - ${destination ?? 'Куда'}`
    : null;

  const dates = departureDate
    ? returnDate
      ? `${formatCartDate(departureDate)} - ${formatCartDate(returnDate)}`
      : `${formatCartDate(departureDate)} - выберите дату возвращения`
    : null;

  const hasActivityDetails = activities.length > 0 || liftTypes.length > 0;
  const activityLabel = activities.length > 0
    ? activities.join(', ')
    : 'Активность не выбрана';
  const liftTypesLabel = liftTypes.length > 0
    ? ` (${liftTypes.join(', ')})`
    : '';

  const transferDetails = transfer?.type === 'needed'
    ? ' (цена за человека)'
    : transfer?.type === 'own-car' && transfer.parking
      ? ` (парковка ${transfer.parking === 'needed' ? 'нужна' : 'не нужна'})`
      : '';

  const hasCompleteRoute = Boolean(fromCity && toCity);
  const ticketPrice = hasCompleteRoute ? MOCK_TICKET_PRICE : 0;
  const activityPrice = calculateActivityPrice(activities, liftTypes);
  const accommodationPrice = accommodation?.pricePerNight ?? 0;
  const transferPrice = transfer?.priceFrom ?? 0;
  const levelPrice = level ? MOCK_SKI_LEVEL_PRICES[level] : 0;
  const additionalOptionsPrice = calculateAdditionalOptionsPrice(additional);

  const totalPrice = ticketPrice
    + activityPrice
    + accommodationPrice
    + transferPrice
    + levelPrice
    + additionalOptionsPrice;

  const hasSelectedItems = hasTicketDetails
    || hasActivityDetails
    || Boolean(accommodation)
    || Boolean(transfer)
    || Boolean(people)
    || Boolean(level)
    || additional.length > 0;
  const hasVisibleItems = hasSelectedItems || activeSelectorId !== null;

  const saveCart = () => {
    if (!hasSelectedItems) {
      setModal({ type: 'save-empty' });
      return;
    }
    if (!isAuth) {
      setModal({ type: 'save-unauthorized' });
      return;
    }
    const snapshot = {
      fromCity,
      fromCountry,
      toCity,
      toCountry,
      departureDate: departureDate?.toISOString() ?? null,
      returnDate: returnDate?.toISOString() ?? null,
      activities,
      liftTypes,
      accommodation,
      transfer,
      people,
      level,
      additional,
      totalPrice,
    };

    try {
      // Заменить localStorage на API сохранения в «Избранные».
      window.localStorage.setItem(
        'ride-trip-constructor-cart',
        JSON.stringify(snapshot),
      );
      setModal({ type: 'save-success' });
    } catch {
      setModal({ type: 'save-error' });
    }
  };

  const downloadPdf = () => {
    if (!hasSelectedItems) {
      setModal({ type: 'pdf-empty' });
      return;
    }
    try {
      // Подключить API генерации PDF; сейчас сохраняется существующая печать.
      window.print();
    } catch {
      setModal({ type: 'pdf-service-error' })
    }
  };

  const shareCart = async () => {
    const shareText = [
      route,
      dates,
      hasActivityDetails ? `${activityLabel}${liftTypesLabel}` : null,
      accommodation?.name ?? null,
      transfer?.label ?? null,
      people ? formatGuestSummary(people) : null,
      level,
      additional.length > 0 ? additional.join(', ') : null,
      `Итого: от ${formatPrice(totalPrice)} за человека`,
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Моё путешествие в Три шага',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        window.alert('Не удалось поделиться путешествием');
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${shareText}\n${window.location.href}`,
      );
      window.alert('Описание путешествия скопировано');
    } catch {
      window.alert('Не удалось скопировать описание путешествия');
    }
  };

  return (
    <aside className={style.card} aria-label="Корзина конструктора путешествия">
      <h2 className={style.title}>Ваше путешествие</h2>

      <div className={style.cartContent}>
        {!hasVisibleItems ? (
          <div className={style.emptyStateWrapper}>
            <EmptyState
              description="и мы начнём подбирать варианты"
              icon={<SadfaceIcon aria-hidden="true" />}
              title="Добавьте параметры,"
            />
          </div>
        ) : (
          <>
          <p className={style.subtitle}>Вот что вы выбрали</p>
            {(hasTicketDetails || isSelectingTickets) && (
              <section className={style.cartItem} aria-label="Билеты">
                <CartItemHeader
                  onReset={clearTickets}
                  resetLabel="Сбросить билеты"
                  title="Билеты:"
                />

                <p aria-live="polite" className={style.primaryValue}>
                  {(route || isSelectingFrom || isSelectingTo) && (
                    <>
                      <span className={isSelectingFrom ? style.selectingStatus : undefined}>
                        {isSelectingFrom ? 'Выбирается сейчас...' : origin ?? 'Откуда'}
                      </span>
                      {' - '}
                      <span className={isSelectingTo ? style.selectingStatus : undefined}>
                        {isSelectingTo ? 'Выбирается сейчас...' : destination ?? 'Куда'}
                      </span>
                    </>
                  )}
                  {(dates || isSelectingDates) && (
                    <span className={style.secondaryValue}>
                      {' ('}
                      <span className={isSelectingDates ? style.selectingStatus : undefined}>
                        {isSelectingDates ? 'Выбирается сейчас...' : dates}
                      </span>
                      {')'}
                    </span>
                  )}
                </p>
                {hasCompleteRoute && <PriceLine price={ticketPrice} />}
              </section>
            )}

            {(hasActivityDetails || isSelectingActivity) && (
              <section className={style.cartItem} aria-label="Вид активности">
                <CartItemHeader
                  onReset={clearActivities}
                  resetLabel="Сбросить вид активности"
                  title="Вид активности:"
                />
                {isSelectingActivity ? (
                  <p aria-live="polite" className={style.selectingStatus}>
                    Выбирается сейчас...
                  </p>
                ) : (
                  <>
                    <p className={style.primaryValue}>
                      <span>{activityLabel}</span>
                      {liftTypesLabel && (
                        <span className={style.secondaryValue}>{liftTypesLabel}</span>
                      )}
                    </p>
                    <PriceLine price={activityPrice} />
                  </>
                )}
              </section>
            )}

            {(accommodation || isSelectingAccommodation) && (
              <section className={style.cartItem} aria-label="Проживание">
                <CartItemHeader
                  onReset={clearAccommodation}
                  resetLabel="Сбросить проживание"
                  title="Проживание:"
                />
                {isSelectingAccommodation ? (
                  <p aria-live="polite" className={style.selectingStatus}>
                    Выбирается сейчас...
                  </p>
                ) : accommodation ? (
                  <>
                    <p className={style.primaryValue}>
                      <span>{accommodation.name}</span>
                      <span className={style.secondaryValue}> (цена за ночь)</span>
                    </p>
                    <PriceLine price={accommodationPrice} />
                  </>
                ) : null}
              </section>
            )}

            {(transfer || isSelectingTransfer) && (
              <section className={style.cartItem} aria-label="Трансфер">
                <CartItemHeader
                  onReset={clearTransfer}
                  resetLabel="Сбросить трансфер"
                  title="Трансфер:"
                />
                {isSelectingTransfer ? (
                  <p aria-live="polite" className={style.selectingStatus}>
                    Выбирается сейчас...
                  </p>
                ) : transfer ? (
                  <>
                    <p className={style.primaryValue}>
                      <span>{transfer.label}</span>
                      {transferDetails && (
                        <span className={style.secondaryValue}>{transferDetails}</span>
                      )}
                    </p>
                    <PriceLine price={transferPrice} />
                  </>
                ) : null}
              </section>
            )}

            {(
              people
              || level
              || additional.length > 0
              || isSelectingPeople
              || isSelectingLevel
              || isSelectingAdditional
            ) && (
              <section
                className={style.additionalInfoSection}
                aria-label="Дополнительная информация"
              >
                <h3 className={style.additionalInfoTitle}>
                  Дополнительная информация:
                </h3>

                {(people || isSelectingPeople) && (
                  <div className={style.cartItem}>
                    <CartItemHeader
                      onReset={clearPeople}
                      resetLabel="Сбросить количество человек"
                      title="Количество человек:"
                    />
                    {isSelectingPeople ? (
                      <p aria-live="polite" className={style.selectingStatus}>
                        Выбирается сейчас...
                      </p>
                    ) : people ? (
                      <>
                        <p className={style.primaryValue}>
                          {formatGuestSummary(people)}
                        </p>
                        {/* TODO: Переработать формат гостей, отделить описание (в скобках) от основы */}
                        {/* <span className={style.secondaryValue}>{formatGuestSummary(people)}</span> */}
                        <PriceLine price={0} />
                      </>
                    ) : null}
                  </div>
                )}

                {(level || isSelectingLevel) && (
                  <div className={style.cartItem}>
                    <CartItemHeader
                      onReset={clearLevel}
                      resetLabel="Сбросить уровень катания"
                      title="Уровень катания:"
                    />
                    {isSelectingLevel ? (
                      <p aria-live="polite" className={style.selectingStatus}>
                        Выбирается сейчас...
                      </p>
                    ) : level ? (
                      <>
                        <p className={style.primaryValue}>{level}</p>
                        <PriceLine price={levelPrice} />
                      </>
                    ) : null}
                  </div>
                )}

                {(additional.length > 0 || isSelectingAdditional) && (
                  <div className={style.cartItem}>
                    <CartItemHeader
                      onReset={clearAdditional}
                      resetLabel="Сбросить дополнительные возможности"
                      title="Дополнительные возможности:"
                    />
                    {isSelectingAdditional ? (
                      <p aria-live="polite" className={style.selectingStatus}>
                        Выбирается сейчас...
                      </p>
                    ) : (
                      <>
                        <p className={style.primaryValue}>
                          {additional.join(', ')}
                        </p>
                        <PriceLine price={additionalOptionsPrice} />
                      </>
                    )}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      <div className={style.checkoutSection}>
        <CartSummary
          hasSelectedItems={hasSelectedItems}
          onCheckout={() => window.alert('В разработке')}
          totalPrice={totalPrice}
        />

        <CartActions
          actions={[
            { icon: <ResetIcon />, label: 'Сбросить', onClick: () => setModal({ type: 'reset-confirm' }) },
            { icon: <SaveIcon />, label: 'Сохранить', onClick: saveCart },
            { icon: <DownloadIcon />, label: 'Скачать PDF', onClick: downloadPdf },
            { icon: <ShareIcon />, label: 'Поделиться', onClick: () => void shareCart() },
          ]}
        />
      </div>
      <ConstructorCartModal
        state={modal}
        onClose={closeModal}
        onResetConfirm={() => {
          resetCart();
          closeModal();
        }}
        onLogin={() => openAuth('login')}
        onRegister={() => openAuth('register')}
      />
    </aside>
  );
}

