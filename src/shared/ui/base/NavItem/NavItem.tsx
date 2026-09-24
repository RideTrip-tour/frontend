import { NavLink, useLocation } from 'react-router'
import type { NavLinkRenderProps } from 'react-router'
import style from './navitem.module.scss'
import './variables.css'
import clsx from 'clsx'

function NavItem({ to, label }: { to: string; label: string }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <NavLink
      to={to}
      className={({ isActive }: NavLinkRenderProps) =>
        clsx(
          style.navitem,
          {
            // Неактивные состояния
            [style['navitem--home']]: isHomePage && !isActive,
            [style['navitem--default']]: !isHomePage && !isActive,
            // Активные состояния
            [style['navitem--active-home']]: isHomePage && isActive,
            [style['navitem--active-default']]: !isHomePage && isActive,
          }
        )
      }
    >
      {label}
    </NavLink>
  )
}

export default NavItem