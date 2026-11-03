import { StatusPill } from '@/shared/ui/base/StatusPill';

export type TourStatus = 'active' | 'process' | 'booking' | 'archive';

interface TourCardStatusProps {
  text: string;
  status: TourStatus;
}

const STATUS_COLORS: Record<TourStatus, { backgroundColor: string; color: string }> = {
  active: {
    backgroundColor: 'rgba(60, 179, 113, 0.1)',
    color: 'var(--color-green)',
  },
  process: {
    backgroundColor: 'var(--color-light-gray-25)',
    color: 'var(--color-gray-dark)',
  },
  booking: {
    backgroundColor: 'rgba(255, 138, 0, 0.1)',
    color: 'var(--color-orange)',
  },
  archive: {
    backgroundColor: 'var(--color-light-gray-25)',
    color: 'var(--color-gray)',
  },
};

export const TourCardStatus = ({ text, status }: TourCardStatusProps) => {
  const colors = STATUS_COLORS[status] ?? {
    backgroundColor: 'var(--color-light-gray-25)',
    color: 'var(--color-gray)',
  };

  return (
    <StatusPill
      text={text}
      backgroundColor={colors.backgroundColor}
      color={colors.color}
    />
  );
};

export default TourCardStatus;
