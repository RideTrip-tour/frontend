import clsx from 'clsx';

import { MinusIcon, PlusIcon } from '@/assets/icons/constructor';

import styles from './QuantityStepper.module.scss';

interface QuantityStepperProps {
  value: number;
  valueLabel?: string;
  min?: number;
  max?: number;
  decrementLabel: string;
  incrementLabel: string;
  onChange: (value: number) => void;
  className?: string;
}

export function QuantityStepper({
  value,
  valueLabel,
  min = 0,
  max,
  decrementLabel,
  incrementLabel,
  onChange,
  className,
}: Readonly<QuantityStepperProps>) {
  return (
    <div className={clsx(styles.counter, className)}>
      <button
        aria-label={decrementLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        <MinusIcon aria-hidden="true" />
      </button>
      <output aria-live="polite">{valueLabel ?? value}</output>
      <button
        aria-label={incrementLabel}
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <PlusIcon aria-hidden="true" />
      </button>
    </div>
  );
}
