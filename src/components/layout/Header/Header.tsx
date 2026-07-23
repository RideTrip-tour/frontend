import { Button } from '@/shared/ui/base/Button'
import style from './header.module.scss'
import { useNavigate } from 'react-router-dom'
import NavItem from '@/shared/ui/base/NavItem'
import { useAuthStore } from '@/store'

export function Header() {
  const navigate = useNavigate();
  const isAuth = useAuthStore((s) => s.isAuth);

  return (
    <header className={style.header}>
        <div className={style.header__inner}>

          <div className={style.header__logo}>LOGO</div>

          <nav className={style.header__nav}>
            <NavItem to="/"       label="Главная"     />
            <NavItem to="/search" label="Найти отдых" />
            <NavItem to="/tours"  label="Мои туры"    />
            <NavItem to="/saved"  label="Избранные"   />
          </nav>

          <Button
            text={isAuth ? 'Профиль' : 'Авторизация'}
            icon="material-symbols:arrow-forward-rounded"
            onClick={() => isAuth ? navigate('/?menu=1') : navigate('/?auth=login')}
            variant="primary"
          />

        </div>
    </header>
  )
}