import './variables.css'
import style from './checkoption.module.scss'
import Checkbox from '@/shared/ui/base/Checkbox'

interface CheckOptionProps {
  checked: boolean
  onChange?: (value: boolean) => void
  title: string
  description?: string
}

const CheckOption = ({ checked, onChange, title, description }: CheckOptionProps) => {
  return (
    <div className={style.checkoption}>
      <Checkbox
        checked={checked}
        onChange={onChange}
      />
      <div className={style.checkoption__content}>
        <div className={style.checkoption__title}>
          {title}
        </div>
        {description && (
          <div className={style.checkoption__description}>
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckOption