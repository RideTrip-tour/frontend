import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  PasswordEmailSentModal,
  PasswordResetSuccessModal,
  RegistrationEmailSentModal,
  RegistrationErrorModal,
  RegistrationSuccessModal,
  ResetPasswordModal,
  UnifiedAuthModal,
  VerifyModal
} from '../components/auth';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
  resetPasswordRequest
} from '@/services/authService';

type View =
  | 'login'
  | 'forgot'
  | 'reset'
  | 'register'
  | 'password-email-sent'
  | 'password-reset-success'
  | 'registration-email-sent'
  | 'registration-success'
  | 'registration-error'
  | 'verify'
  | 'none';

const t = { duration: 0.25, ease: 'easeInOut' } as const;

const slideDownExit = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
  transition: t
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [view, setView] = useState<View>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [email, setEmail] = useState('');
  const [verifyToken, setVerifyToken] = useState('');

  useEffect(() => {
    const token = searchParams.get('verify_token');
    if (token) {
      setVerifyToken(token);
      setView('verify');
    }
  }, [searchParams]);

  const handleUnifiedSubmit = async (
    modalView: 'login' | 'register' | 'forgot',
    data: { email: string; password?: string }
  ) => {
    setServerError('');
    setIsLoading(true);

    try {
      setEmail(data.email);

      if (modalView === 'login') {
        await loginRequest(data.email, data.password!);
      } else if (modalView === 'register') {
        await registerRequest({ email: data.email, password: data.password! });
        setView('registration-email-sent');
      } else if (modalView === 'forgot') {
        await forgotPasswordRequest(data.email);
        setView('password-email-sent');
      }
    } catch (err: any) {
      setServerError(err.message || 'Ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  const showUnified = view === 'login' || view === 'forgot' || view === 'register';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', padding: '20px' }}>
      <AnimatePresence mode="wait">
        {showUnified && (
          <motion.div key="auth" {...slideDownExit}>
            <UnifiedAuthModal
              initialView={view as 'login' | 'register' | 'forgot'}
              isLoading={isLoading}
              serverError={serverError}
              onClose={() => setView('none')}
              onClearError={() => setServerError('')}
              onSubmit={handleUnifiedSubmit}
            />
          </motion.div>
        )}

        {view === 'registration-email-sent' && (
          <motion.div key="reg-email-sent" {...slideDownExit}>
            <RegistrationEmailSentModal
              email={email}
              isLoading={isLoading}
              serverError={serverError}
              onClose={() => setView('none')}
            />
          </motion.div>
        )}

        {view === 'password-email-sent' && (
          <motion.div key="password-email-sent" {...slideDownExit}>
            <PasswordEmailSentModal
              email={email}
              isLoading={isLoading}
              onClose={() => setView('none')}
              setIsLoading={setIsLoading}
              setServerError={setServerError}
            />
          </motion.div>
        )}

        {view === 'password-reset-success' && (
          <motion.div key="password-reset-success" {...slideDownExit}>
            <PasswordResetSuccessModal
              onClose={() => setView('none')}
              onGoToCabinet={() => setView('login')}
            />
          </motion.div>
        )}

        {view === 'reset' && (
          <motion.div key="reset">
            <ResetPasswordModal
              isLoading={isLoading}
              serverError={serverError}
              onClose={() => setView('none')}
              onSubmit={async ({ password, confirmPassword }: { password: string; confirmPassword: string }) => {
                setServerError('');
                if (password !== confirmPassword) {
                  setServerError('Пароли не совпадают');
                  return;
                }

                setIsLoading(true);
                try {
                  await resetPasswordRequest({
                    token: 'тут_токен_из_ссылки',
                    password
                  });
                  setView('password-reset-success');
                } catch (err: any) {
                  setServerError(err.message || 'Ошибка сервера');
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </motion.div>
        )}

        {view === 'registration-success' && (
          <RegistrationSuccessModal
            onClose={() => navigate('/', { replace: true })}
            onHomeClick={() => navigate('/', { replace: true })}
          />
        )}

        {view === 'registration-error' && (
          <RegistrationErrorModal
            onClose={() => navigate('/', { replace: true })}
            onRetry={() => {
              setView('register');
              navigate('/', { replace: true });
            }}
          />
        )}

        {view === 'verify' && verifyToken && (
          <motion.div key="verify" {...slideDownExit}>
            <VerifyModal
              token={verifyToken}
              onClose={() => {
                setView('none');
                navigate('/', { replace: true });
              }}
              onComplete={(success) => {
                setView(success ? 'registration-success' : 'registration-error');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
