import AuthShell from './AuthShell';
import styles from './AuthState.module.scss';

type VerifyModalProps = {
  onClose: () => void;
};

export default function VerifyModal({ onClose }: Readonly<VerifyModalProps>) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={styles.loader} aria-hidden="true" />
        <output className={styles.text} >Проверяем верификацию</output>
      </div>
    </AuthShell>
  );
}

