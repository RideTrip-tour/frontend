import { AlertIcon } from '@/assets/icons/constructor';
import { SuccessIcon } from '@/assets/icons';
import Modal from '@/shared/ui/base/Modal';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { Button } from '@/shared/ui/base/Button';
import { cartModalContent } from '@/widgets/travel-constructor/config/cartModalContent';
import type { CartModalState } from '@/widgets/travel-constructor/model/cartModalTypes';
import styles from './ConstructorCartModal.module.scss';

interface ConstructorCartModalProps {
  state: CartModalState;
  onClose: () => void;
  onResetConfirm: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function ConstructorCartModal({
  state,
  onClose,
  onResetConfirm,
  onLogin,
  onRegister,
}: Readonly<ConstructorCartModalProps>) {
  if (!state) return null;

  if (state.type === 'reset-confirm' || state.type === 'save-unauthorized') {
    const isReset = state.type === 'reset-confirm';
    const title = isReset
      ? 'Вы уверены, что хотите сбросить выбранные параметры?'
      : 'Войдите в аккаунт или зарегистрируйтесь, \n чтобы сохранить поездку или вернуться \n к ней позже';

    return (
      <Modal isOpen onClose={onClose} ariaLabel={title} variant="confirmation">
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          {isReset && (
            <p className={styles.description}>
              Если Вы нажмёте «Сбросить», все изменения будут утеряны.
            </p>
          )}
          <div className={styles.actions}>
            <Button
              variant="light"
              text={isReset ? 'Сбросить' : 'Зарегистрироваться'}
              onClick={isReset ? onResetConfirm : onRegister}
            />
            <Button
              variant="solid"
              text={isReset ? 'Отменить' : 'Войти'}
              onClick={isReset ? onClose : onLogin}
            />
          </div>
        </div>
      </Modal>
    );
  }

  const content = cartModalContent[state.type];

  return (
    <Modal isOpen onClose={onClose} ariaLabel={content.title} variant="message">
      <EmptyState
        variant="message"
        icon={state.type === 'save-success'
          ? <SuccessIcon className={styles.statusIcon} aria-hidden="true" />
          : <AlertIcon className={styles.statusIcon} viewBox="0 0 80 80" aria-hidden="true" />}
        title={content.title}
        description={state.description ?? content.description}
      />
    </Modal>
  );
}
