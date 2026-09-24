import style from './choice.module.scss'
import AdvantageCard from '@/shared/ui/base/AdvantageCard'

function Choice() {
  return (
    <div className={style.choice}>
      <div className={style.choice__header}>
        <div className={style.choice__title}>
          Собраться легко
        </div>
        <div className={style.choice__subtitle}>
          Проверим цены, покажем отели, расскажем что делать с трансфером
        </div>
      </div>

      <div className={style.choice__content}>
        <div className={style.choice__col}>
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
          <AdvantageCard
            icon="famicons:people"
            title="Отзывы без прикрас"
            text="Узнайте что говорят люди, которые уже собирали поездки у нас."
          />
        </div>

        <img
          src="/assets/images/imageBG.png"
          className={style.choice__photo}
          alt=""
        />

        <div className={style.choice__col}>
          <AdvantageCard
            icon="streamline-sharp:zoom-document-solid"
            title="Без неожиданностей"
            text="Вы сразу видите из чего состоит поездка. Без звёздочек и мелкого шрифта."
          />
          <AdvantageCard
            icon="famicons:people"
            title="Прозрачные условия"
            text="Все детали поездки — формат, сложность, условия участия — описаны заранее и без скрытых нюансов."
          />
          <AdvantageCard
            icon="boxicons:taxi-filled"
            title="Трансфер и логистика"
            text="Покажем как добраться, расскажем что взять с собой."
          />
        </div>
      </div>
    </div>
  )
}

export default Choice
