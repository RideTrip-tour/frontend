import { Outlet } from "react-router-dom";

export function PaddedLayout() {
  return (
    <div style={{ paddingTop: "180px", paddingBottom: "120px" }}>
      <Outlet />
    </div>
  );
}

export default PaddedLayout

