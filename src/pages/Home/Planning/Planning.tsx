import style from './planning.module.scss'
import Steps from '@/shared/ui/base/Steps'

function Planning() {
  const handleCta = () => {
    console.log('cta clicked')
  }

  return (
    <div className={style.planning}>
      <div className={style.planning__inner}>
        <div className={style.planning__content}>
          <div className={style.planning__header}>
            <div className={style.planning__title}>
              Всего три шага отделяют вас от поездки
            </div>
            <div className={style.planning__text}>
              Рассказываем, как это работает.
            </div>
          </div>

          <Steps
            steps={{
              1: {
                title: 'Выберите активность и уровень подготовки',
                text: 'Лыжи или сноуборд, новичок или профи'
              },
              2: {
                title: 'Уточните детали',
                text: 'Даты, бюджет, транспорт и трансфер'
              },
              3: {
                title: 'Получите варианты',
                text: 'Цены, маршруты, отели и отзывы'
              }
            }}
            onCtaClick={handleCta}
          />
        </div>
      </div>
    </div>
  )
}

export default Planning