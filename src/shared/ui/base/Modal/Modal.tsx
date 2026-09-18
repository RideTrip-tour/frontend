import { useId, type ReactNode } from 'react';
import ModalOverlay from '@/shared/ui/base/ModalOverlay';
import './variables.css';
import style from './modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'default' | 'wide';
  variant?: 'default' | 'message' | 'confirmation';
  closeLabel?: string;
  ariaLabel?: string;
  className?: string;
}

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  size = 'default',
  variant = 'default',
  closeLabel = 'Закрыть модальное окно',
  ariaLabel = 'Модальное окно',
  className,
}: Readonly<ModalProps>) => {
  const titleId = useId();
  if (!isOpen) return null;

  return (
    <ModalOverlay
      variant="dimmed"
      onClose={onClose}
      ariaLabel={ariaLabel}
      ariaLabelledBy={title ? titleId : undefined}
    >
      <div className={[
        style.modal__content,
        size === 'wide' ? style['modal__content--wide'] : '',
        variant === 'default' ? '' : style[variant],
        className,
      ].filter(Boolean).join(' ')}>
        {title && <h2 className={style.modal__title} id={titleId}>{title}</h2>}
        <button
          aria-label={closeLabel}
          className={style.modal__close}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className={style.modal__body}>{children}</div>
      </div>
    </ModalOverlay>
  );
};

export default Modal;