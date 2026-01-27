import { Container } from "./Container";

export function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 24 }}
    >
      <Container>
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            opacity: 0.8
          }}
        >
          © {new Date().getFullYear()} RideTrip
        </div>
      </Container>
    </footer>
  );
}
