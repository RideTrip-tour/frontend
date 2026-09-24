import { useState } from 'react';
import Modal from '@/shared/ui/base/Modal';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { SearchInput } from '@/shared/ui/base/SearchInput';
import {
  AlertIcon,
  PlusIcon,
  MinusIcon,
} from '@/assets/icons/constructor';
import { MOCK_MAP_MARKERS } from '@/widgets/travel-constructor/mocks/mapMarkers';
import styles from './AccommodationMapModal.module.scss';
import { Button } from '@/shared/ui/base/Button'

interface AccommodationMapModalProps {
  isOpen: boolean;
  isMapAvailable?: boolean;
  onClose: () => void;
}

export function AccommodationMapModal({
  isOpen,
  isMapAvailable = true,
  onClose,
}: AccommodationMapModalProps) {
  const [locationQuery, setLocationQuery] = useState('');
  const [onlySelectedCity, setOnlySelectedCity] = useState(false);

  return (
    <Modal
      closeLabel="Закрыть карту отелей"
      isOpen={isOpen}
      onClose={onClose}
      size="wide"
      title="Город или регион"
    >
      <div className={styles.content}>
        <SearchInput
          ariaLabel="Поиск города или региона"
          id="hotel-map-location"
          name="hotel-map-location"
          onChange={setLocationQuery}
          placeholder="Начните вводить, а мы подскажем"
          value={locationQuery}
        />

        <label className={styles.cityFilter}>
          <input
            checked={onlySelectedCity}
            className={styles.checkbox}
            onChange={(event) => setOnlySelectedCity(event.target.checked)}
            type="checkbox"
          />
          <span>Сначала в выбранном городе</span>
        </label>

        <div className={styles.map}>
          <img
            alt="Заглушка карты с расположением отелей"
            className={styles.mapImage}
            src="/assets/images/constructor/hotels-map-placeholder.jpg"
          />

          {isMapAvailable && MOCK_MAP_MARKERS.map((marker, index) => (
            <span
              aria-hidden="true"
              className={styles.marker}
              key={`${marker.left}-${marker.top}`}
              style={marker}
            >
              {index + 1}
            </span>
          ))}

          <div className={styles.zoomControls}>
            {/*TODO: Доработать компонент IconButton и использовать его для кнопок зума */}
            <button
              aria-label="Увеличить масштаб"
              className={styles.zoomButton}
              onClick={() => {}}
              type="button"
            >
              <PlusIcon aria-hidden="true" />
            </button>

            <button
              aria-label="Уменьшить масштаб"
              className={styles.zoomButton}
              onClick={() => {}}
              type="button"
            >
              <MinusIcon aria-hidden="true" />
            </button>
          </div>

          {!isMapAvailable && (
            <div className={styles.mapError}>
              <EmptyState
                description="Попробуйте позже."
                icon={<AlertIcon aria-hidden="true" />}
                title="Карты временно недоступны"
              />
            </div>
          )}
        </div>

        <Button
          className={styles.showAllButton}
          text="Показать все отели"
          icon="material-symbols:arrow-forward-rounded"
          onClick={() => {}}
          variant="secondary"
        />
      </div>
    </Modal>
  );
}