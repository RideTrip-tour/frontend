import { useState } from 'react';
import {
  ForgotPasswordModal,
  LoginModal,
  PasswordEmailSentModal,
  PasswordResetSuccessModal,
  RegisterModal,
  RegistrationEmailSentModal,
  RegistrationErrorModal,
  RegistrationSuccessModal,
  ResetPasswordModal
} from '../components/auth';

type View =
  | 'login'
  | 'forgot'
  | 'reset'
  | 'register'
  | 'password-email-sent'
  | 'password-reset-success'
  | 'registration-email-sent'
  | 'registration-success'
  | 'registration-error';

export function HomePage() {
  const [view, setView] = useState<View>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const fakeDelay = () => new Promise<void>((resolve) => setTimeout(resolve, 1200));

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* dev-кнопки для переключения между модалками */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: 10,
          background: '#111',
          borderRadius: 8
        }}
      >
        {[
          'login',
          'forgot',
          'reset',
          'register',
          'password-email-sent',
          'password-reset-success',
          'registration-email-sent',
          'registration-success',
          'registration-error'
        ].map((v) => (
          <button
            key={v}
            onClick={() => {
              setView(v as View);
              setServerError('');
              setIsLoading(false);
            }}
            style={{
              padding: '5px 8px',
              fontSize: 11,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: view === v ? '#1f6fe5' : '#333',
              color: '#fff'
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* LOGIN */}
      {view === 'login' && (
        <LoginModal
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onForgotPassword={() => setView('forgot')}
          onRegisterClick={() => setView('register')}
          onSubmit={async ({ email, password }) => {
            setServerError('');
            setIsLoading(true);
            await fakeDelay();

            if (email !== 'travel.designer@mail.ru' || password !== 'Travel26') {
              setServerError('Email или пароль введены неверно');
            }

            setIsLoading(false);
          }}
        />
      )}

      {/* FORGOT PASSWORD */}
      {view === 'forgot' && (
        <ForgotPasswordModal
          onClose={() => console.log('close')}
          onBackToLogin={() => setView('login')}
          onRegisterClick={() => setView('register')}
          onSubmit={async (email: string) => {
            setServerError('');
            setIsLoading(true);

            await fakeDelay();

            if (email !== 'travel.designer@mail.ru') {
              setServerError('Такой пользователь не существует');
            } else {
              setView('password-email-sent');
            }

            setIsLoading(false);
          }}
        />
      )}

      {/* RESET PASSWORD */}
      {view === 'reset' && (
        <ResetPasswordModal
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onSubmit={async (data: { password: string; confirmPassword: string }) => {
            const { password, confirmPassword } = data;
            setServerError('');

            if (password !== confirmPassword) {
              setServerError('Пароли не совпадают');
              return;
            }

            setIsLoading(true);
            await fakeDelay();
            setIsLoading(false);

            setView('password-reset-success');
          }}
        />
      )}

      {view === 'register' && (
        <RegisterModal
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onLoginClick={() => setView('login')}
          onTermsClick={() => console.log('terms')}
          onSubmit={async (data: {
            email: string;
            password: string;
            confirmPassword: string;
            acceptedTerms: boolean;
          }) => {
            const { email, password, confirmPassword, acceptedTerms } = data;

            setServerError('');

            if (email === 'travel.designer@mail.ru') {
              setServerError('Такой пользователь уже существует');
              return;
            }

            if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
              setServerError('Минимум 8 символов, буквы и цифры');
              return;
            }

            if (password !== confirmPassword) {
              setServerError('Пароли не совпадают');
              return;
            }

            if (!acceptedTerms) return;

            setIsLoading(true);
            await fakeDelay();
            setIsLoading(false);

            setView('registration-email-sent');
          }}
        />
      )}

      {/* OTHER MODALS */}
      {view === 'password-email-sent' && (
        <PasswordEmailSentModal
          onClose={() => console.log('close')}
          onResend={() => console.log('resend')}
        />
      )}

      {view === 'password-reset-success' && (
        <PasswordResetSuccessModal
          onClose={() => console.log('close')}
          onGoToCabinet={() => setView('login')}
        />
      )}

      {view === 'registration-email-sent' && (
        <RegistrationEmailSentModal
          onClose={() => console.log('close')}
          onResend={() => console.log('resend')}
        />
      )}

      {view === 'registration-success' && (
        <RegistrationSuccessModal
          onClose={() => console.log('close')}
          onHomeClick={() => console.log('home')}
        />
      )}

      {view === 'registration-error' && (
        <RegistrationErrorModal
          onClose={() => console.log('close')}
          onRetry={() => setView('register')}
        />
      )}
    </div>
  );
}
