import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './variables.css';
import style from './modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'default' | 'wide';
  closeLabel?: string;
}

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  size = 'default',
  closeLabel = 'Закрыть модальное окно',
}: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const contentClassName = [
    style.modal__content,
    size === 'wide' ? style['modal__content--wide'] : '',
  ].filter(Boolean).join(' ');

  return createPortal(
    <div
      className={style.modal__overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={contentClassName}
        role="dialog"
      >
        {title && (
          <h2 className={style.modal__title} id={titleId}>
            {title}
          </h2>
        )}

        <button
          aria-label={closeLabel}
          className={style.modal__close}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className={style.modal__body}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
