import { useCallback, useEffect, useState } from 'react';
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

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: t
};

function viewFromParam(param: string | null): View | null {
  if (param === 'login' || param === 'register' || param === 'forgot') return param;
  return null;
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [view, setView] = useState<View>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [email, setEmail] = useState('');
  const [verifyToken, setVerifyToken] = useState('');

  useEffect(() => {
    const token = searchParams.get('verify_token');
    if (token) {
      setVerifyToken(token);
      setView('verify');
      return;
    }

    const auth = viewFromParam(searchParams.get('auth'));
    if (auth) {
      setView(auth);
      setServerError('');
      setIsLoading(false);
    }
  }, [searchParams]);

  const closeAuth = useCallback(() => {
    setView('none');
    navigate('/', { replace: true });
  }, [navigate]);

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
        closeAuth();
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
          <motion.div key="auth" {...fade}>
            <UnifiedAuthModal
              initialView={view as 'login' | 'register' | 'forgot'}
              isLoading={isLoading}
              serverError={serverError}
              onClose={closeAuth}
              onClearError={() => setServerError('')}
              onSubmit={handleUnifiedSubmit}
            />
          </motion.div>
        )}

        {view === 'registration-email-sent' && (
          <motion.div key="reg-email-sent" {...fade}>
            <RegistrationEmailSentModal
              email={email}
              isLoading={isLoading}
              serverError={serverError}
              onClose={closeAuth}
            />
          </motion.div>
        )}

        {view === 'password-email-sent' && (
          <motion.div key="password-email-sent" {...fade}>
            <PasswordEmailSentModal
              email={email}
              isLoading={isLoading}
              onClose={closeAuth}
              setIsLoading={setIsLoading}
              setServerError={setServerError}
            />
          </motion.div>
        )}

        {view === 'password-reset-success' && (
          <motion.div key="password-reset-success" {...fade}>
            <PasswordResetSuccessModal
              onClose={closeAuth}
              onGoToCabinet={() => setView('login')}
            />
          </motion.div>
        )}

        {view === 'reset' && (
          <motion.div key="reset">
            <ResetPasswordModal
              isLoading={isLoading}
              serverError={serverError}
              onClose={closeAuth}
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
          <motion.div key="verify" {...fade}>
            <VerifyModal
              token={verifyToken}
              onClose={closeAuth}
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
