import { NavLink } from 'react-router-dom'
import type { NavLinkRenderProps } from 'react-router-dom'
import style from './navitem.module.scss'
import './variables.css'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }: NavLinkRenderProps) =>
        isActive
          ? `${style.navitem} ${style['navitem--active']}`
          : style.navitem
      }
    >
      {label}
    </NavLink>
  )
}

export default NavItem