import { Button } from '@/shared/ui/base/Button'
import style from './header.module.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import NavItem from '@/shared/ui/base/NavItem'
import { useAuthStore } from '@/store'
import { useEffect } from 'react'
import clsx from 'clsx'

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAuthStore((s) => s.isAuth);
  
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
    <header className={clsx(style.header, {
      [style.header_home]: isHomePage,
      [style.header_default]: !isHomePage
    })}>
      <div className={clsx(style.header__inner, {
        [style.header__inner_home]: isHomePage,
        [style.header__inner_default]: !isHomePage
      })}>
        <div className={clsx(style.header__logo, {
          [style.header__logo_home]: isHomePage,
          [style.header__logo_default]: !isHomePage
        })}>
          LOGO
        </div>
        <nav className={clsx(style.header__nav, {
          [style.header__nav_home]: isHomePage,
          [style.header__nav_default]: !isHomePage
        })}>
          <NavItem to="/"       label="Главная"     />
          <NavItem to="/trip-builder" label="Собрать поездку" />
          <NavItem to="/tours"  label="Мои туры"    />
          <NavItem to="/saved"  label="Избранные"   />
        </nav>
        <Button
          text={isAuth ? 'Профиль' : 'Авторизация'}
          icon="material-symbols:arrow-forward-rounded"
          onClick={() => isAuth ? navigate('/profile') : navigate('/?auth=login')}
          variant="primary"
          className={clsx(style.profileButton, {
            [style.button_home]: isHomePage,
            [style.button_default]: !isHomePage
          })}
        />
      </div>
    </header>
  )
}