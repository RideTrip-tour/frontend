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
  shareText: string;
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

function openShareWindow(url: string): boolean {
  let popup: Window | null = null;

  try {
    popup = window.open('', '_blank');
    if (!popup) return false;

    popup.opener = null;
    popup.location.replace(url);
    return true;
  } catch {
    popup?.close();
    return false;
  }
}

export function CartShareMenu({ shareText, hasSelectedItems }: CartShareMenuProps) {
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

  const shareTo = async (messenger: 'telegram' | 'whatsapp') => {
    if (!hasSelectedItems) {
      setFeedback({ type: 'empty' });
      return;
    }

    setFeedback(null);
    const pageUrl = window.location.href;
    const url = messenger === 'telegram'
      ? new URL('https://t.me/share/url')
      : new URL('https://wa.me/');

    if (messenger === 'telegram') {
      url.searchParams.set('url', pageUrl);
      url.searchParams.set('text', shareText);
    } else {
      url.searchParams.set('text', `${shareText}\n${pageUrl}`);
    }

    if (openShareWindow(url.href)) {
      setIsOpen(false);
      buttonRef.current?.focus();
      return;
    }

    setIsPending(true);
    try {
      await navigator.clipboard.writeText(pageUrl);
      setFeedback({ type: 'app-error-copied' });
    } catch {
      setFeedback({ type: 'app-error' });
    } finally {
      setIsPending(false);
    }
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
            <button type="button" className={styles.item} disabled={isPending} onClick={() => void copyLink()}>
              <CopyIcon aria-hidden="true" />
              <span>Скопировать ссылку</span>
            </button>
          </li>
          <li>
            <button type="button" className={styles.item} disabled={isPending} onClick={() => void shareTo('telegram')}>
              <TelegramIcon aria-hidden="true" />
              <span>Telegram</span>
            </button>
          </li>
          <li>
            <button type="button" className={styles.item} disabled={isPending} onClick={() => void shareTo('whatsapp')}>
              <WhatsappIcon aria-hidden="true" />
              <span>WhatsApp</span>
            </button>
          </li>
        </ul>
        <p
          className={styles.feedback}
          data-type={feedback?.type}
          role="status"
          aria-atomic="true"
        >
          {feedback ? MESSAGES[feedback.type] : ''}
        </p>
      </div>
    </div>
  );
}
