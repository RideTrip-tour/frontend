import { NavLink } from "react-router-dom";
import { Container } from "./Container";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  fontWeight: 600,
  opacity: isActive ? 1 : 0.75
});

export function Header() {
  return (
    <header style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
      <Container className="header-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            gap: 16
          }}
        >
          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>RideTrip</div>

          <nav style={{ display: "flex", gap: 12 }}>
            <NavLink to="/" style={linkStyle}>
              Home
            </NavLink>
            <NavLink to="/about" style={linkStyle}>
              About
            </NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
