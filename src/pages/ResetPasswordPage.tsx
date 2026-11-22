import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import PasswordResetErrorModal from '@/components/auth/PasswordResetErrorModal';
import PasswordResetSuccessModal from '@/components/auth/PasswordResetSuccessModal';
import ResetPasswordModal from '@/components/auth/ResetPasswordModal';
import { getPasswordResetErrorMessage } from '@/features/auth/lib/getPasswordResetErrorMessage';
import { AUTH_PATHS } from '@/features/auth/model/authRoutes';
import { resetPasswordRequest } from '@/services/authService';

function PasswordReset({ token }: Readonly<{ token: string }>) {
  const navigate = useNavigate();
  const submitting = useRef(false);
  const active = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    active.current = true;

    return () => {
      active.current = false;
    };
  }, []);

  const handleSubmit = async ({ password }: { password: string }) => {
    if (submitting.current) return;

    submitting.current = true;
    setIsLoading(true);
    setServerError('');

    try {
      await resetPasswordRequest({ token, password });
      if (active.current) {
        void navigate(AUTH_PATHS.resetPassword, {
          replace: true,
          state: { passwordReset: true },
        });
      }
    } catch (error) {
      if (active.current) setServerError(getPasswordResetErrorMessage(error));
    } finally {
      submitting.current = false;
      if (active.current) setIsLoading(false);
    }
  };

  return (
    <ResetPasswordModal
      isLoading={isLoading}
      serverError={serverError}
      onClose={() => void navigate('/', { replace: true })}
      onSubmit={handleSubmit}
      onClearError={() => setServerError('')}
      onRequestNewLink={() => void navigate('/?auth=forgot', { replace: true })}
    />
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') ?? '').trim();
  const close = () => void navigate('/', { replace: true });

  if (!token && location.state?.passwordReset === true) {
    return (
      <PasswordResetSuccessModal
        onClose={close}
        onGoToCabinet={() => void navigate('/?auth=login', { replace: true })}
      />
    );
  }

  if (!token) {
    return (
      <PasswordResetErrorModal
        onClose={close}
        onRequestNewLink={() => void navigate('/?auth=forgot', { replace: true })}
      />
    );
  }

  return (
    <PasswordReset
      key={token}
      token={token}
    />
  );
}
