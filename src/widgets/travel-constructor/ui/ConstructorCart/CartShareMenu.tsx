import {
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import {
  ShareIcon,
  CopyIcon,
  TelegramIcon,
  WhatsappIcon
} from '@/assets/icons/constructor';
import cartStyles from './ConstructorCart.module.scss';
import styles from './CartShareMenu.module.scss';

interface CartShareMenuProps {
  hasSelectedItems: boolean;
}

const MESSAGES = {
  copied: 'Ссылка скопирована',
  'copy-error': 'Не получилось скопировать ссылку. Попробуем ещё раз?',
  empty: 'Выберите параметры, чтобы поделиться',
  'app-error': 'Не удалось открыть приложение, но ссылка не была скопирована',
  'app-error-copied': 'Не удалось открыть приложение, но ссылка скопирована',
};

type FeedbackType = keyof typeof MESSAGES;

export function CartShareMenu({ hasSelectedItems }: Readonly<CartShareMenuProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: FeedbackType } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const buttonId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !feedback) return;

    const timeout = window.setTimeout(() => setFeedback(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [feedback, isOpen]);

  const copyLink = async () => {
    if (!hasSelectedItems) {
      setFeedback({ type: 'empty' });
      return;
    }

    setFeedback(null);
    setIsPending(true);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setFeedback({ type: 'copied' });
    } catch {
      setFeedback({ type: 'copy-error' });
    } finally {
      setIsPending(false);
    }
  };

  const shareTo = () => {
    if (!hasSelectedItems) {
      setFeedback({ type: 'empty' });
      return;
    }

    setFeedback(null);
    window.alert('В разработке');
  };

  return (
    <div
      className={styles.wrapper}
      ref={containerRef}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className={clsx(cartStyles.actionButton, styles.trigger)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => {
          setFeedback(null);
          setIsOpen((open) => !open);
        }}
      >
        <span aria-hidden="true" className={cartStyles.actionIcon}><ShareIcon /></span>
        <span>Поделиться</span>
      </button>

      <div id={menuId} className={styles.dropdown} hidden={!isOpen}>
        <ul aria-labelledby={buttonId} className={styles.menu}>
          <li>
            <button
              type="button"
              className={styles.item}
              disabled={isPending}
              onClick={() => void copyLink()}
            >
              <CopyIcon aria-hidden="true" />
              <span>Скопировать ссылку</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.item}
              disabled={isPending}
              onClick={shareTo}
            >
              <TelegramIcon aria-hidden="true" />
              <span>Telegram</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.item}
              disabled={isPending}
              onClick={shareTo}
            >
              <WhatsappIcon aria-hidden="true" />
              <span>WhatsApp</span>
            </button>
          </li>
        </ul>
        <output
          className={styles.feedback}
          data-type={feedback?.type}
          aria-atomic="true"
        >
          {feedback ? MESSAGES[feedback.type] : ''}
        </output>
      </div>
    </div>
  );
}
