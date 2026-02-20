import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {verifyEmailRequest} from '@/services/authService.ts'

type Status = "loading" | "success" | "error";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<Status>("loading");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Токен верификации отсутствует.");
      return;
    }

    async function verify() {
      try {
        await verifyEmailRequest(token);
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        setErrorCode(error?.code ?? null);
        setErrorMessage(error?.message ?? "Ошибка верификации");
      }
    }

    verify();
  }, [searchParams]);

  // редирект через 10 секунд при success или already verified
  useEffect(() => {
    if (
      status === "success" ||
      errorCode === "VERIFY_USER_ALREADY_VERIFIED"
    ) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [status, errorCode, navigate]);

  return (
    <div style={{ padding: 32 }}>
      <h1>Подтверждение регистрации</h1>

      {status === "loading" && (
        <p>⏳ Ожидание верификации...</p>
      )}

      {status === "success" && (
        <div>
          <p>✅ Email успешно подтверждён!</p>
          <p>Теперь вы можете войти в аккаунт.</p>
          <p>Редирект на главную через 10 секунд...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          {errorCode === "VERIFY_USER_ALREADY_VERIFIED" ? (
            <>
              <p>ℹ️ Пользователь уже верифицирован.</p>
              <p>Редирект на главную через 10 секунд...</p>
            </>
          ) : (
            <>
              <p>❌ {errorMessage}</p>

              {errorCode === "VERIFY_USER_BAD_TOKEN" && (
                <button onClick={() => navigate("/register")}>
                  Перейти к регистрации
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}