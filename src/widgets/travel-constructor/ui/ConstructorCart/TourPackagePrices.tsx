import {
  calculateTourAddonCost,
  formatTourAddonQuantity,
  type TourPackageQuote,
} from '@/entities/tour/model/package';
import { formatPrice } from '@/widgets/travel-constructor/lib/formatters';

import styles from './ConstructorCart.module.scss';

export function TourPackagePrices({ quote }: Readonly<{ quote: TourPackageQuote }>) {
  return (
    <section aria-label="Стоимость тура">
      <h3 className={styles.sectionTitle}>Тур «{quote.title}»</h3>
      <dl className={styles.packagePrices}>
        <div>
          <dt>Базовая стоимость</dt>
          <dd>{formatPrice(quote.basePricePerPerson)}</dd>
        </div>
        {quote.addons.map((addon) => (
          <div key={addon.id}>
            <dt>
              {addon.label} · {formatTourAddonQuantity(addon)}
            </dt>
            <dd>{formatPrice(calculateTourAddonCost(addon))}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.packageNote}>
        При замене маршрута, проживания, активности или трансфера пакет и его допуслуги будут сняты.
        Конструктор пересчитает поездку по отдельным услугам.
      </p>
    </section>
  );
}
