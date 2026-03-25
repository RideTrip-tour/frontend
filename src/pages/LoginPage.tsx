import { useAuthStore } from "@/store";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login({
      token: "fake-jwt",
      user: { id: "1", email: "test@mail.com", name: "Test User" }
    });
    navigate("/");
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}           style={{
        marginTop: '100px'
      }}>Login</button>
    </div>
  );
}
