import { Outlet } from 'react-router';

export function PaddedLayout() {
  return (
    <div style={{ paddingTop: '50px', paddingBottom: '120px' }}>
      <Outlet />
    </div>
  );
}

export default PaddedLayout;
