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
import { apiClient } from '@/api/client';
import { ApiError } from '@/api/errors';

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
  const [email, setEmail] = useState(''); // нужна для Forgot/PasswordEmailSent

  const fakeDelay = () => new Promise<void>((resolve) => setTimeout(resolve, 1200));

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* dev-кнопки */}
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
          'password-email-sent',
          'reset',
          'password-reset-success',
          'register',
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
          onSubmit={async ({ email: loginEmail, password }) => {
            setServerError('');
            setIsLoading(true);

            try {
              setEmail(loginEmail); // сохраняем email для последующих модалок
              await apiClient.post('/api/auth/login', {
                grant_type: 'password',
                username: loginEmail,
                password
              });

              console.log('Login successful');
              // переход куда нужно
            } catch (err: any) {
              if (err.response?.data?.detail) setServerError(err.response.data.detail);
              else if (err instanceof ApiError) setServerError(err.message);
              else setServerError('Ошибка сервера');
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

      {/* FORGOT PASSWORD */}
      {view === 'forgot' && (
        <ForgotPasswordModal
          email={email}
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onBackToLogin={() => setView('login')}
          onRegisterClick={() => setView('register')}
          onSubmit={async (email) => {
            setServerError('');
            setIsLoading(true);
            setEmail(email);

            try {
              await apiClient.post('/api/auth/forgot-password', { email });
              setView('password-email-sent');
            } catch (err: any) {
              if (err.response?.data?.detail) setServerError(err.response.data.detail);
              else if (err instanceof ApiError) setServerError(err.message);
              else setServerError('Ошибка сервера');
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

      {/* PASSWORD EMAIL SENT */}
      {view === 'password-email-sent' && (
        <PasswordEmailSentModal
          email={email}
          isLoading={isLoading}
          onClose={() => console.log('close')}
          setIsLoading={setIsLoading}
          setServerError={setServerError}
        />
      )}

      {/* RESET PASSWORD */}
      {view === 'reset' && (
        <ResetPasswordModal
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onSubmit={async ({ password, confirmPassword }) => {
            setServerError('');
            if (password !== confirmPassword) {
              setServerError('Пароли не совпадают');
              return;
            }

            setIsLoading(true);
            try {
              await apiClient.post('/api/auth/reset-password', {
                token: 'тут_токен_из_ссылки', // должен быть реальный токен
                password
              });
              setView('password-reset-success');
            } catch (err: any) {
              if (err.response?.data?.detail) setServerError(err.response.data.detail);
              else if (err instanceof ApiError) setServerError(err.message);
              else setServerError('Ошибка сервера');
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

      {/* REGISTER */}
      {view === 'register' && (
        <RegisterModal
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onLoginClick={() => setView('login')}
          onTermsClick={() => console.log('terms')}
          onSubmit={async ({ email, password, confirmPassword, acceptedTerms }) => {
            setServerError('');

            if (!acceptedTerms) return;

            setIsLoading(true);
            try {
              await apiClient.post('/api/auth/register', { email, password });
              setView('registration-email-sent');
            } catch (err: any) {
              if (err.response?.data?.detail) setServerError(err.response.data.detail);
              else if (err instanceof ApiError) setServerError(err.message);
              else setServerError('Ошибка сервера');
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

      {/* OTHER MODALS */}
      {view === 'password-reset-success' && (
        <PasswordResetSuccessModal
          onClose={() => console.log('close')}
          onGoToCabinet={() => setView('login')}
        />
      )}

      {view === 'registration-email-sent' && (
        <RegistrationEmailSentModal
          email={email}
          isLoading={isLoading}
          serverError={serverError}
          onClose={() => console.log('close')}
          onResend={async () => {
            setServerError('');
            setIsLoading(true);

            try {
              // ВАЖНО:
              // По текущему openapi отдельной ручки resend verification email нет.
              // Когда бэк добавит endpoint, сюда нужно будет поставить реальный запрос.

              throw new Error(
                'Эндпоинт повторной отправки письма подтверждения не найден в текущем API'
              );
            } catch (err: any) {
              if (err.response?.data?.detail) {
                setServerError(err.response.data.detail);
              } else if (err instanceof ApiError) {
                setServerError(err.message);
              } else {
                setServerError(
                  'Для повторной отправки письма бэкенд пока не предоставляет отдельную ручку'
                );
              }
            } finally {
              setIsLoading(false);
            }
          }}
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
