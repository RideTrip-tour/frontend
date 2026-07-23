import { useAuthStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { meRequest } from "@/services/authService";

export function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await meRequest();
      setUser(user);
      navigate("/");
    } catch {
      alert("Не удалось получить данные пользователя");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
