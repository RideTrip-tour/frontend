import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import VerifyModal from '@/components/auth/VerifyModal';
import VerificationErrorModal from '@/components/auth/VerificationErrorModal';
import { useRegistrationVerification } from '@/hooks/useRegistrationVerification';

function RegistrationVerification({ token }: { token: Readonly<string> }) {
  const navigate = useNavigate();

  const close = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const complete = useCallback(() => {
    navigate('/', {
      replace: true,
      state: { registrationVerified: true },
    });
  }, [navigate]);

  const { error, retry } = useRegistrationVerification(token, complete);

  if (error) {
    return (
      <VerificationErrorModal
        message={error.message}
        onClose={close}
        onRetry={error.canRetry ? retry : undefined}
      />
    );
  }

  return <VerifyModal onClose={close} />;
}

export default function RegistrationVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('verify_token') ?? '').trim();

  return <RegistrationVerification key={token} token={token} />;
}
