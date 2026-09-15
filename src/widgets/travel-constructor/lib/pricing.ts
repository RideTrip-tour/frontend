import {
  MOCK_ACTIVITY_PRICES,
  MOCK_ADDITIONAL_OPTION_PRICES,
  MOCK_LIFT_PRICES,
} from '@/widgets/travel-constructor/mocks/prices';
import type { AdditionalOption } from '@/widgets/travel-constructor/model/types';

export function calculateActivityPrice(
  activities: string[],
  liftTypes: string[],
) {
  return [...activities, ...liftTypes].reduce(
    (total, option) => total + (
      MOCK_ACTIVITY_PRICES[option]
      ?? MOCK_LIFT_PRICES[option]
      ?? 0
    ),
    0,
  );
}

export function calculateAdditionalOptionsPrice(
  options: AdditionalOption[],
) {
  return options.reduce(
    (total, option) => total + MOCK_ADDITIONAL_OPTION_PRICES[option],
    0,
  );
}
