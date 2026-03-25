import style from './planning.module.scss'
import Steps from '@/shared/ui/base/Steps'

function Planning() {
  return (
    <>
      <div className={style.planning}>
        <div className={style.planning__title}>
          <div className={style.planning__title_small}>
            Найди свое идеальное путешествие
          </div>
        </div>
        <div className={style.planning__text}>
          Выберите направление, уровень и формат отдыха — и найдите подходящий тур за несколько минут.
        </div>
        <div className={style.planning__steps}>
          <Steps
            steps={{
              1: {
                title: 'Выбираете активность',
                text: 'Укажите формат отдыха и направление, которое вам интересно в данный момент.'
              },
              2: {
                title: 'Уточняете условия',
                text: 'Отметьте уровень подготовки, даты и важные параметры поездки.'
              },
              3: {
                title: 'Находите варианты',
                text: 'Мы подбираем маршруты с понятными условиями и стоимостью.'
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Planning

