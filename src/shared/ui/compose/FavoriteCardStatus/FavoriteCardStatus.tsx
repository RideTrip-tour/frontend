import { StatusPill } from '@/shared/ui/base/StatusPill';

export type FavoriteStatus = 'beginner' | 'intermediate' | 'advanced';

interface FavoriteCardStatusProps {
  text: string;
  status: FavoriteStatus;
}

const STATUS_COLORS: Record<FavoriteStatus, { backgroundColor: string; color: string }> = {
  beginner: {
    backgroundColor: 'rgba(60, 179, 113, 0.1)',
    color: 'var(--color-green)',
  },
  intermediate: {
    backgroundColor: 'rgba(255, 138, 0, 0.1)',
    color: 'var(--color-orange)',
  },
  advanced: {
    backgroundColor: 'var(--color-blue-dark-1-10)',
    color: 'var(--color-blue-dark-1)',
  },
};

export const FavoriteCardStatus = ({ text, status }: FavoriteCardStatusProps) => (
  <StatusPill
    text={text}
    backgroundColor={STATUS_COLORS[status].backgroundColor}
    color={STATUS_COLORS[status].color}
  />
);

export default FavoriteCardStatus;
