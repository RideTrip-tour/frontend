import { useState } from 'react';
import {
  RegisterModal,
  RegistrationEmailSentModal,
  RegistrationSuccessModal,
  RegistrationErrorModal
} from '../components/auth';

type View = 'register' | 'register-email-sent' | 'register-success' | 'register-error';

export default function HomePage() {
  const [view, setView] = useState<View>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  if (view === 'register-email-sent') {
    return (
      <RegistrationEmailSentModal
        onClose={() => console.log('close')}
        onResend={() => console.log('resend email')}
      />
    );
  }

  if (view === 'register-success') {
    return (
      <RegistrationSuccessModal
        onClose={() => console.log('close')}
        onHomeClick={() => console.log('go home')}
      />
    );
  }

  if (view === 'register-error') {
    return (
      <RegistrationErrorModal
        onClose={() => console.log('close')}
        onRetry={() => setView('register')}
      />
    );
  }

  return (
    <RegisterModal
      isLoading={isLoading}
      serverError={serverError}
      onClose={() => console.log('close')}
      onLoginClick={() => console.log('go login')}
      onTermsClick={() => console.log('open terms')}
      onSubmit={async ({ email, password, confirmPassword, acceptedTerms }) => {
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

        await new Promise((resolve) => setTimeout(resolve, 1200));

        setIsLoading(false);
        setView('register-email-sent');
      }}
    />
  );
}
