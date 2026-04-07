import { Button } from '@/shared/ui/base/Button'
import style from './header.module.scss'
import {useNavigate} from 'react-router-dom'
import NavItem from '@/shared/ui/base/NavItem'

export function Header() {
  const navigate = useNavigate();

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
            text="Авторизация"
            icon="material-symbols:arrow-forward-rounded"
            onClick={() =>  navigate("/login") }
            variant="primary"
          />

        </div>
    </header>
  )
}