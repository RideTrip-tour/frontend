import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import ManIcon from '@/assets/icons/gender/man.svg';
import UnspecifiedIcon from '@/assets/icons/gender/unspecified.svg';
import WomanIcon from '@/assets/icons/gender/woman.svg';
import NotificationIcon from '@/assets/icons/notifications/notification-default.svg';
import { Button } from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/IconButton';
import { useAuthStore } from '@/store/authStore.ts';
import { useNotificationsStore, selectUnreadCount } from '@/store/notificationsStore.ts';
import { useProfileStore } from '@/store/profileStore.ts';

import { HeaderDropdown } from '../HeaderDropdown/HeaderDropdown';

import style from './HeaderActions.module.scss';

interface HeaderActionsProps {
  isHomePage: boolean;
}

export function HeaderActions({ isHomePage }: Readonly<HeaderActionsProps>) {
  const navigate = useNavigate();
  const isAuth = useAuthStore((s) => s.isAuth);
  const gender = useProfileStore((s) => s.personal.gender);
  const unreadCount = useNotificationsStore(selectUnreadCount);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  if (!isAuth) {
    return (
      <Button
        text="Авторизация"
        variant="primary"
        icon="material-symbols:arrow-forward-rounded"
        onClick={() => navigate('/?auth=login')}
        className={style.authButton}
      />
    );
  }

  const getProfileIcon = () => {
    switch (gender) {
      case 'male':
      case 'Мужской':
        return ManIcon;
      case 'female':
      case 'Женский':
        return WomanIcon;
      default:
        return UnspecifiedIcon;
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const closeProfileDropdown = () => {
    setIsProfileOpen(false);
  };

  return (
    <div className={clsx(style.actions, !isHomePage && style.actions_wrapped)}>
      <IconButton
        variant="secondary"
        icon={NotificationIcon}
        ariaLabel={unreadCount > 0 ? `Уведомлений: ${unreadCount}` : 'Уведомлений нет'}
        onClick={() => navigate('/notifications')}
        className={clsx(
          style.iconButton,
          style.notificationButton,
          unreadCount > 0 && style.hasNotifications,
        )}
        iconClassName={style.bellIcon}
      />
      <div
        className={style.profileWrapper}
        style={{ position: 'relative' }}
      >
        <IconButton
          ref={profileButtonRef}
          variant="secondary"
          icon={getProfileIcon()}
          ariaLabel="Профиль"
          ariaExpanded={isProfileOpen}
          ariaHasPopup="menu"
          onClick={toggleProfileDropdown}
          className={style.iconButton}
        />
        <HeaderDropdown
          isOpen={isProfileOpen}
          onClose={closeProfileDropdown}
          buttonRef={profileButtonRef}
        />
      </div>
    </div>
  );
}
