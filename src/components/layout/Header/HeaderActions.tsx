import clsx from 'clsx';
import { useNavigate } from 'react-router';

import ManIcon from '@/assets/icons/gender/man.svg';
import UnspecifiedIcon from '@/assets/icons/gender/unspecified.svg';
import WomanIcon from '@/assets/icons/gender/woman.svg';
import NotificationIcon from '@/assets/icons/notifications/notification-default.svg'
import NotificationActiveIcon from '@/assets/icons/notifications/notification-dot.svg'
import { Button } from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/IconButton';
import { useAuthStore } from '@/store/authStore';
import { useNotificationsStore, selectUnreadCount } from '@/store/notificationsStore';
import { useProfileStore } from '@/store/profileStore';

import style from './HeaderActions.module.scss';

export function HeaderActions() {
  const navigate = useNavigate();
  const isAuth = useAuthStore((s) => s.isAuth);
  const gender = useProfileStore((s) => s.personal.gender);
  const unreadCount = useNotificationsStore(selectUnreadCount);

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

  console.log(getProfileIcon())
  return (
    <div className={style.actions}>
      <IconButton
        variant="secondary"
        icon={unreadCount > 0 ? NotificationActiveIcon : NotificationIcon}
        ariaLabel={unreadCount > 0 ? `Уведомлений: ${unreadCount}` : 'Уведомлений нет'}
        onClick={() => navigate('/notifications')}
        className={clsx(style.iconButton, unreadCount > 0 && style.hasNotifications)}
      />
      <IconButton
        variant="secondary"
        icon={getProfileIcon()}
        ariaLabel="Профиль"
        onClick={() => navigate('/profile')}
        className={style.iconButton}
      />
    </div>
  );
}