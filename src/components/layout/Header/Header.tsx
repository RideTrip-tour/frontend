import clsx from 'clsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

import NavItem from '@/shared/ui/base/NavItem';

import { HeaderActions } from './HeaderActions/HeaderActions.tsx';

import style from './header.module.scss';

export function Header() {
  const location = useLocation();

  // Определяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/';

  // Добавляем класс к body для стилизации
  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('home-page');
    } else {
      document.body.classList.remove('home-page');
    }

    return () => {
      document.body.classList.remove('home-page');
    };
  }, [isHomePage]);

  return (
    <header
      className={clsx(style.header, {
        [style.header_home]: isHomePage,
        [style.header_default]: !isHomePage,
      })}
    >
      <div
        className={clsx(style.header__inner, {
          [style.header__inner_home]: isHomePage,
          [style.header__inner_default]: !isHomePage,
        })}
      >
        <div
          className={clsx(style.header__logo, {
            [style.header__logo_home]: isHomePage,
            [style.header__logo_default]: !isHomePage,
          })}
        >
          LOGO
        </div>
        <nav
          className={clsx(style.header__nav, {
            [style.header__nav_home]: isHomePage,
            [style.header__nav_default]: !isHomePage,
          })}
        >
          <NavItem
            to="/"
            label="Главная"
          />
          <NavItem
            to="/trip-builder"
            label="Собрать поездку"
          />
          <NavItem
            to="/tours"
            label="Мои туры"
          />
          <NavItem
            to="/saved"
            label="Избранные"
          />
        </nav>
        <HeaderActions isHomePage={isHomePage} />
      </div>
    </header>
  );
}
