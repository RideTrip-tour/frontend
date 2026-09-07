import { useState } from 'react';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { AlertIcon } from '@/assets/icons/constructor';
import type {
  ParkingPreference,
  TransferSelection,
  TransferType,
} from '@/widgets/travel-constructor/model/types';
import {
  TRANSFER_OPTIONS,
  TRANSFER_PRICE_FROM,
  type TransferOption,
} from '@/widgets/travel-constructor/config/transferOptions';
import styles from './TransferSelector.module.scss';

const transferPriceFormatter = new Intl.NumberFormat('ru-RU');

interface TransferSelectorProps {
  value: TransferSelection | null;
  onChange: (selection: TransferSelection | null) => void;
  onComplete?: (selection: TransferSelection) => void;
  isTransferAvailable?: boolean;
}

export function TransferSelector({
  value,
  onChange,
  onComplete,
  isTransferAvailable = true,
}: TransferSelectorProps) {
  const [attemptedType, setAttemptedType] = useState<TransferType | null>(
    value?.type ?? null,
  );
  const [showUnavailableError, setShowUnavailableError] = useState(false);

  const completeSelection = (selection: TransferSelection) => {
    onChange(selection);
    onComplete?.(selection);
  };

  const selectTransferType = (option: TransferOption) => {
    setAttemptedType(option.type);
    setShowUnavailableError(false);

    if (option.type === 'needed') {
      if (!isTransferAvailable) {
        onChange(null);
        setShowUnavailableError(true);
        return;
      }

      completeSelection({
        type: option.type,
        label: option.label,
        priceFrom: TRANSFER_PRICE_FROM,
      });
      return;
    }

    if (option.type === 'self') {
      completeSelection({
        type: option.type,
        label: option.label,
      });
      return;
    }

    onChange(null);
  };

  const selectParking = (parking: ParkingPreference) => {
    setAttemptedType('own-car');
    setShowUnavailableError(false);

    completeSelection({
      type: 'own-car',
      label: 'На своём автомобиле',
      parking,
    });
  };

  const selectedType = attemptedType ?? value?.type ?? null;
  const selectedParking = value?.type === 'own-car' ? value.parking : undefined;

  return (
    <div className={styles.selector}>
      <label className={styles.option}>
        <input
          checked={selectedType === 'needed'}
          className={styles.radio}
          name="transfer-type"
          onChange={() => selectTransferType(TRANSFER_OPTIONS[0])}
          type="radio"
          value="needed"
        />
        <span className={styles.optionLabel}>Нужен трансфер</span>
        <span className={styles.price}>
          <span>от</span>
          <strong>{transferPriceFormatter.format(TRANSFER_PRICE_FROM)} ₽</strong>
        </span>
      </label>

      {showUnavailableError && (
        <div className={styles.emptyStateWrapper}>
          <EmptyState
            description="Попробуйте ещё раз позже, или выберите другой вариант"
            icon={<AlertIcon aria-hidden="true" />}
            title="Трансфер не найден"
          />
        </div>
      )}

      <label className={styles.option}>
        <input
          checked={selectedType === 'self'}
          className={styles.radio}
          name="transfer-type"
          onChange={() => selectTransferType(TRANSFER_OPTIONS[1])}
          type="radio"
          value="self"
        />
        <span className={styles.optionLabel}>Доберусь самостоятельно</span>
      </label>

      <div className={styles.carRow}>
        <label className={styles.option}>
          <input
            checked={selectedType === 'own-car'}
            className={styles.radio}
            name="transfer-type"
            onChange={() => selectTransferType(TRANSFER_OPTIONS[2])}
            type="radio"
            value="own-car"
          />
          <span className={styles.optionLabel}>На своём автомобиле</span>
        </label>

        <fieldset className={styles.parking}>
          <legend>Парковка:</legend>

          <label className={styles.parkingOption}>
            <input
              checked={selectedParking === 'needed'}
              className={styles.smallRadio}
              name="parking-preference"
              onChange={() => selectParking('needed')}
              type="radio"
              value="needed"
            />
            <span>Нужна</span>
          </label>

          <label className={styles.parkingOption}>
            <input
              checked={selectedParking === 'not-needed'}
              className={styles.smallRadio}
              name="parking-preference"
              onChange={() => selectParking('not-needed')}
              type="radio"
              value="not-needed"
            />
            <span>Не нужна</span>
          </label>
        </fieldset>
      </div>
    </div>
  );
}
