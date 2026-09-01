import './variables.css'
import style from './sectionheader.module.scss'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  variant?: 'default' | 'muted'
}

const SectionHeader = ({ title, subtitle, variant = 'default' }: SectionHeaderProps) => {
  const classes = [
    style.sectionheader,
    variant === 'muted' ? style['sectionheader--muted'] : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className={style.sectionheader__title}>
        {title}
      </div>
      {subtitle && (
        <div className={style.sectionheader__subtitle}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default SectionHeader