import style from './pagesection.module.scss'
import './variables.css'
import type { ReactNode } from 'react'

interface PageSectionProps {
  paddingVertical?: number
  paddingHorizontal?: number
  isEditing?: boolean
  children: ReactNode
}

const PageSection = ({
                       paddingVertical,
                       paddingHorizontal,
                       isEditing = false,
                       children
                     }: PageSectionProps) => {
  return (
    <div
      className={style.pagesection}
      style={{
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        border: isEditing ? '1px solid var(--color-blue)' : undefined,
      }}
    >
      {children}
    </div>
  )
}

export default PageSection