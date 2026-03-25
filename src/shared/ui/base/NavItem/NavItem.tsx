import { NavLink } from 'react-router-dom'
import type { NavLinkProps } from 'react-router-dom'
import style from './navitem.module.scss'
import './variables.css'

export function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }: NavLinkProps['className'] extends (arg: infer T) => any ? T : never) =>
        isActive
          ? `${style.navitem} ${style['navitem--active']}`
          : style.navitem
      }
    >
      {label}
    </NavLink>
  )
}