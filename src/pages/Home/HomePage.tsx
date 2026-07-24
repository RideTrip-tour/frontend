import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Welcome from '@/pages/Home/Welcome'
import Choice from '@/pages/Home/Choice'
import Recommendations from '@/pages/Home/Recommendations'
import Planning from '@/pages/Home/Planning'
import PersonalSelection from '@/pages/Home/PersonalSelection'
import Clients from '@/pages/Home/Clients'
import {
  PasswordEmailSentModal,
  PasswordResetSuccessModal,
  RegistrationEmailSentModal,
  RegistrationErrorModal,
  RegistrationSuccessModal,
  ResetPasswordModal,
  TestMenuModal,
  UnifiedAuthModal,
  VerifyModal
} from '@/components/auth';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest
} from '@/services/authService';

type View = 'login' | 'register' | 'forgot' | 'password-email-sent' | 'registration-email-sent' | 'registration-success' | 'registration-error' | 'verify' | 'reset-password' | 'password-reset-success' | 'none';

const t = { duration: 0.25, ease: 'easeInOut' } as const;
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: t };

function viewFromParam(param: string | null): View | null {
  if (param === 'login' || param === 'register' || param === 'forgot') return param;
  return null;
}

function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [view, setView] = useState<View>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [email, setEmail] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [showTestMenu, setShowTestMenu] = useState(false);

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
      return;
    }

    if (searchParams.get('menu') === '1') {
      setShowTestMenu(true);
    }
  }, [searchParams]);

  const closeAuth = () => {
    setView('none');
    navigate('/', { replace: true });
  };

  const closeTestMenu = () => {
    setShowTestMenu(false);
    navigate('/', { replace: true });
  };

  const handleTestOpenView = (v: string) => {
    if (v === 'verify') {
      setVerifyToken('test-mock-token');
    }
    setView(v as View);
    setServerError('');
    setIsLoading(false);
  };

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
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    setView('password-reset-success');
  };

  const showUnified = view === 'login' || view === 'register' || view === 'forgot';

  return (
    <>
      <Welcome />
      <Choice />
      <Recommendations />
      <Planning />
      <PersonalSelection />
      <Clients />

      {showTestMenu && (
        <TestMenuModal
          onOpenView={handleTestOpenView}
          onClose={closeTestMenu}
        />
      )}

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

        {view === 'registration-success' && (
          <RegistrationSuccessModal
            onClose={() => { setView('none'); navigate('/', { replace: true }); }}
            onHomeClick={() => { setView('none'); navigate('/', { replace: true }); }}
          />
        )}

        {view === 'registration-error' && (
          <RegistrationErrorModal
            onClose={() => { setView('none'); navigate('/', { replace: true }); }}
            onRetry={() => { setView('register'); navigate('/', { replace: true }); }}
          />
        )}

        {view === 'verify' && verifyToken && (
          <motion.div key="verify" {...fade}>
            <VerifyModal
              token={verifyToken}
              onClose={closeAuth}
              onComplete={(success) => { setView(success ? 'registration-success' : 'registration-error'); }}
            />
          </motion.div>
        )}

        {view === 'reset-password' && (
          <motion.div key="reset-password" {...fade}>
            <ResetPasswordModal
              isLoading={isLoading}
              serverError={serverError}
              onClose={closeAuth}
              onSubmit={handleResetPassword}
            />
          </motion.div>
        )}

        {view === 'password-reset-success' && (
          <motion.div key="password-reset-success" {...fade}>
            <PasswordResetSuccessModal
              onClose={closeAuth}
              onGoToCabinet={closeAuth}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomePage
