import { useAuthStore } from "@/store";

export function HomePage() {
  const { isAuth, user, login, logout } = useAuthStore();

  return (
    <div>
      <h1>Home</h1>

      {isAuth ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button
          onClick={() =>
            login({
              token: "fake-jwt-token",
              user: {
                id: "1",
                email: "test@mail.com",
                name: "Test User"
              }
            })
          }
        >
          Login
        </button>
      )}
    </div>
  );
}
