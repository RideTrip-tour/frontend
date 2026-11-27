import { Navigate, Outlet, useLocation } from 'react-router';

import {
  getPartnerOffersReturnPath,
  hasConstructorSelections,
  useConstructor,
} from '@/widgets/travel-constructor';

interface TripBuilderFlowRouteProps {
  requiredStage: 'offers' | 'plan';
}

export function TripBuilderFlowRoute({ requiredStage }: Readonly<TripBuilderFlowRouteProps>) {
  const hasSelections = useConstructor(hasConstructorSelections);
  const flowStage = useConstructor((state) => state.flowStage);
  const location = useLocation();
  const offersPath =
    requiredStage === 'offers'
      ? location.pathname + location.search + location.hash
      : getPartnerOffersReturnPath(location.state);

  if (!hasSelections || flowStage === 'constructor') {
    return (
      <Navigate
        to="/trip-builder"
        replace
        state={{ partnerOffersReturnTo: offersPath }}
      />
    );
  }

  if (requiredStage === 'plan' && flowStage !== 'plan') {
    return (
      <Navigate
        to={offersPath}
        replace
      />
    );
  }

  return <Outlet />;
}
