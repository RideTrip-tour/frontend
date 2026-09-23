import { useId } from 'react'
import ModalOverlay from '@/shared/ui/base/ModalOverlay'
import { logoutRequest } from '@/services/authService';
import styles from './TestMenu.module.scss';

const modalItems = [
  { view: 'login', label: 'Вход' },
  { view: 'register', label: 'Регистрация' },
  { view: 'forgot', label: 'Забыли пароль' },
  { view: 'password-email-sent', label: 'Письмо (сброс пароля)' },
  { view: 'registration-email-sent', label: 'Письмо (регистрация)' },
  { view: 'registration-success', label: 'Регистрация успешна' },
  { view: 'registration-error', label: 'Ошибка регистрации' },
  { view: 'verify', label: 'Верификация email' },
  { view: 'verification-error', label: 'Ошибка подтверждения почты' },
  { view: 'reset-password', label: 'Сброс пароля (форма)' },
  { view: 'password-reset-success', label: 'Пароль изменён' },
] as const;

type TestMenuModalProps = {
  onOpenView: (view: string) => void;
  onClose: () => void;
};

export default function TestMenuModal({ onOpenView, onClose }: TestMenuModalProps) {
  const titleId = useId()
  const handleLogout = async () => {
    await logoutRequest();
    localStorage.removeItem('auth-storage');
    onClose();
  };

  return (
    <ModalOverlay
      className={styles.overlay}
      onClose={onClose}
      ariaLabelledBy={titleId}
      lockScroll={false}
    >
      <div className={styles.menu}>
        <button type="button" aria-label="Закрыть модальное окно" className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h2 id={titleId} className={styles.title}>Тестовое меню</h2>
        <p className={styles.subtitle}>Выберите модальное окно для просмотра:</p>
        <div className={styles.grid}>
          {modalItems.map((item) => (
            <button
              key={item.view}
              className={styles.item}
              onClick={() => { onOpenView(item.view); onClose(); }}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className={`${styles.item} ${styles.logout}`} onClick={handleLogout}>
            ВЫХОД
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
