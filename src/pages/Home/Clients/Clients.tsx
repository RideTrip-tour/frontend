import style from './clients.module.scss'
import ReviewSlider from '@/shared/ui/compose/ReviewSlider'
import ReviewBigCard from '@/shared/ui/compose/ReviewBigCard'

function Clients() {

  const reviews = [
    {
      photo: '/assets/images/imageBG.png',
      name: 'Иван Иванов',
      category: 'Трассовое катание',
      rating: 4.8,
      date: '15.03.2026',
      text: 'Отличный курорт! Все было супер, рекомендуем для всей семьи.'
    },
    {
      photo: '/assets/images/imageBG.png',
      name: 'Мария Петрова',
      category: 'Фрирайд',
      rating: 4.6,
      date: '12.03.2026',
      text: 'Очень понравились трассы и гиды, планируем вернуться снова.'
    },
    {
      photo: '/assets/images/imageBG.png',
      name: 'Алексей Смирнов',
      category: 'Экстремальное катание',
      rating: 5.0,
      date: '10.03.2026',
      text: 'Адреналин зашкаливает! Для опытных райдеров — топ.'
    },
    {
      photo: '/assets/images/imageBG.png',
      name: 'Ольга Кузнецова',
      category: 'Семейное катание',
      rating: 4.3,
      date: '08.03.2026',
      text: 'Хорошее место для детей, много развлечений и безопасно.'
    },
    {
      photo: '/assets/images/imageBG.png',
      name: 'Дмитрий Волков',
      category: 'Горные лыжи',
      rating: 4.7,
      date: '05.03.2026',
      text: 'Крутой сервис и отличные трассы. Очень рекомендую!'
    }
  ]

  return (
    <>
      <div className={style.clients}>
        <div className={style.clients__title}>
          <div className={style.clients__title_big}>
            Ваше мнение
          </div>
          <div className={style.clients__title_small}>
            Что говорят наши клиенты
          </div>
        </div>
        <div className={style.clients__text}>
          Посмотрите, что говорят счастливые путешественники, которые доверили нам свой отдых.
        </div>
        <div className={style.clients__slider}>
          <ReviewSlider
            items={reviews.map((review, index) => (
              <ReviewBigCard key={index} {...review} />
            ))}
          />
        </div>
      </div>
    </>
  )
}

export default Clients

