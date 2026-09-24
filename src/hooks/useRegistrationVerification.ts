import { useEffect, useRef, useState } from 'react';
import { getVerificationError, verifyRequest } from '@/services/authService';

const MISSING_TOKEN_ERROR = {
  message: 'В ссылке отсутствует токен подтверждения. Откройте полную ссылку из письма.',
  canRetry: false,
};

export function useRegistrationVerification(token: string, onComplete: () => void) {
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<ReturnType<typeof getVerificationError> | null>(null);
  const request = useRef<{
    token: string;
    attempt: number;
    promise: ReturnType<typeof verifyRequest>;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    // Повтор эффекта в StrictMode использует Promise уже отправленного запроса.
    if (request.current?.token !== token || request.current.attempt !== attempt) {
      request.current = { token, attempt, promise: verifyRequest(token) };
    }

    let active = true;
    void request.current.promise.then(
      () => {
        if (active) onComplete();
      },
      (reason: unknown) => {
        if (active) setError(getVerificationError(reason));
      },
    );

    return () => { active = false; };
  }, [token, attempt, onComplete]);

  const retry = () => {
    setError(null);
    setAttempt((value) => value + 1);
  };

  return { error: token ? error : MISSING_TOKEN_ERROR, retry };
}
