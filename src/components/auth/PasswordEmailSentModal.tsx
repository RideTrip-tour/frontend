import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import EmailIcon from '@/assets/icons/email.svg';
import { apiClient } from '@/api/client';
import { ApiError } from '@/api/ApiError';

type PasswordEmailSentModalProps = {
  email: string;
  isLoading: boolean;
  onClose?: () => void;
  setIsLoading: (loading: boolean) => void;
  setServerError: (error: string) => void;
};

export default function PasswordEmailSentModal({
  email,
  isLoading,
  onClose,
  setIsLoading,
  setServerError
}: PasswordEmailSentModalProps) {
  const handleResend = async () => {
    setServerError('');
    setIsLoading(true);

    try {
      await apiClient.post('/api/auth/forgot-password', { email });
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setServerError(err.response.data.detail);
      } else if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Ошибка сервера');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={`${styles.iconBox} ${styles.blueBox}`}>
          <img src={EmailIcon} alt="электронная почта" />
        </div>

        <h2 className={styles.bigTitle}>
          Письмо уже отправлено
          <br />
          на вашу почту
        </h2>

        <p className={styles.text}>Письмо не пришло? Проверьте папку «Спам»</p>

        <button
          type="button"
          className={styles.linkButton}
          onClick={handleResend}
          disabled={isLoading}
        >
          {isLoading ? 'Отправка...' : 'Отправить ещё раз'}
        </button>
      </div>
    </AuthShell>
  );
}
