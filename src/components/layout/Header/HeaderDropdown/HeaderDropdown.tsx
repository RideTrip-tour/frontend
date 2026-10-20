import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import ExitIcon from '@/assets/icons/exit.svg';
import { logoutRequest } from '@/services/authService';
import LogoutConfirmModal from '@/shared/ui/compose/Modals/LogoutConfirmModal/LogoutConfirmModal';
import { useAuthStore } from '@/store/authStore.ts';

import style from './HeaderDropdown.module.scss';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export function HeaderDropdown({ isOpen, onClose, buttonRef }: Readonly<ProfileDropdownProps>) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, buttonRef]);

  const handleLogout = async () => {
    setError('');
    setIsLoading(true);
    try {
      await logoutRequest();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сервера');
      setIsLoading(false);
      return;
    }
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const openLogoutConfirm = () => {
    setError('');
    setIsLoading(false);
    setIsLogoutConfirmOpen(true);
  };

  const closeLogoutConfirm = () => {
    setError('');
    setIsLoading(false);
    setIsLogoutConfirmOpen(false);
  };

  const handleKeyDown = (handler: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };

  return (
    <>
      <div
        ref={dropdownRef}
        className={style.dropdown}
        role="menu"
        data-open={isOpen}
      >
        <div
          className={style.item}
          role="menuitem"
          tabIndex={0}
          onClick={() => handleNavigate('/profile')}
          onKeyDown={handleKeyDown(() => handleNavigate('/profile'))}
        >
          <span className={style.label}>Мой профиль</span>
        </div>
        <div
          className={style.item}
          role="menuitem"
          tabIndex={0}
          onClick={() => handleNavigate('/profile/bookings')}
          onKeyDown={handleKeyDown(() => handleNavigate('/profile/bookings'))}
        >
          <span className={style.label}>Мои бронирования</span>
        </div>
        <div
          className={style.item}
          role="menuitem"
          tabIndex={0}
          onClick={() => handleNavigate('/documents')}
          onKeyDown={handleKeyDown(() => handleNavigate('/documents'))}
        >
          <span className={style.label}>Документы</span>
        </div>
        <div
          className={clsx(style.item, style.item_logout)}
          role="menuitem"
          tabIndex={0}
          onClick={openLogoutConfirm}
          onKeyDown={handleKeyDown(openLogoutConfirm)}
        >
          <img
            src={ExitIcon}
            alt=""
            className={style.logoutIcon}
            aria-hidden="true"
          />
          <span className={style.logoutLabel}>Выйти</span>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        isLoading={isLoading}
        serverError={error}
        onClose={closeLogoutConfirm}
        onConfirm={handleLogout}
      />
    </>
  );
}
