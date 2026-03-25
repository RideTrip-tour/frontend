import style from './choice.module.scss'
import AdvantageCard from '@/shared/ui/base/AdvantageCard'

function Choice() {
  return (
    <>
      <div className={style.choice}>
        <div className={style.choice__title}>
          <div className={style.choice__title_big}>
            Нас выбирают
          </div>
          <div className={style.choice__title_small}>
            Осознанный отдых без рисков
          </div>
        </div>
        <div className={style.choice__text}>
          Мы знаем, как сложно выбрать активный отдых, поэтому сделали процесс простым и понятным.
        </div>
        <div className={style.choice__cards}>

          <div className={style.choice__col}>

            <img src="/assets/images/imageBG.png"
                 className={style.choice__img}
                 alt=""
            />
            <AdvantageCard
              icon="carbon:skill-level"
              title="Подбор по уровню"
              text="Мы учитываем ваш опыт и подготовку, чтобы активность соответствовала вашим возможностям."
            />
            <AdvantageCard
              icon="gravity-ui:list-timeline"
              title="Поездка за 3 шага"
              text="Подберите активность, выберите даты и оформите отдых без лишних этапов."
            />
          </div>

          <img src="/assets/images/imageBG.png"
               className={style.choice__photo}
               alt=""
          />

          <div className={style.choice__col}>
            <AdvantageCard
              icon="streamline-sharp:zoom-document-solid"
              title="Прозрачные условия"
              text="Все детали поездки — формат, сложность, условия участия — описаны заранее и без скрытых нюансов."
            />
            <AdvantageCard
              icon="famicons:people"
              title="Реальные отзывы"
              text="Отзывы публикуются от участников поездок и помогают принять решение осознанно."
            />
            <img src="/assets/images/imageBG.png"
                 className={style.choice__img}
                 alt=""
            />
          </div>

        </div>
      </div>
    </>
  )
}

export default Choice

