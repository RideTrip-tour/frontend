import style from './photoblock.module.scss'
import './variables.css'
import {Button} from '@/shared/ui/base/Button'

interface PhotoBlockProps {
  onClick?: () => void
  title?: string
  ctaText?: string
}

const PhotoBlock = ({
                      onClick,
                      title = 'Осталось всего три шага до поездки',
                      ctaText = 'Начать подбор',
                    }: PhotoBlockProps) => {
  return (
    <section className={style.photoblock}>
      <div className={style.photoblock__banner}>
        <h2 className={style.photoblock__title}>{title}</h2>
        {onClick && (
          <div className={style.photoblock__cta}>
            <Button
              onClick={onClick}
              text={ctaText}
              icon="material-symbols:arrow-forward-rounded"
              iconPosition="right"
              variant="primary"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default PhotoBlock