import { useEffect } from 'react';
import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import { verifyRequest } from '@/services/authService';

type VerifyModalProps = {
  token: string;
  onClose: () => void;
  onComplete: (success: boolean) => void;
};

export default function VerifyModal({ token, onClose, onComplete }: VerifyModalProps) {
  useEffect(() => {
    (async () => {
      try {
        await verifyRequest(token);
        onComplete(true);
      } catch {
        onComplete(false);
      }
    })();
  }, [token, onComplete]);

  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={styles.loader} />
        <p className={styles.text}>Проверяем верификацию</p>
      </div>
    </AuthShell>
  );
}
