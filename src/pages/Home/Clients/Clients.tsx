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
      text: 'Мы искали активную поездку с трекингом и комфортным уровнем сервиса. Сайт предложил несколько вариантов с разной сложностью и бюджетом, и нам удалось найти идеальный баланс «нагрузка + комфорт».'
    },
    {
      photo: '/assets/images/imageBG.png',
      name: 'Мария Петрова',
      category: 'Фрирайд',
      rating: 4.6,
      date: '12.03.2026',
      text: 'Я никогда раньше не катался,но по моим параметрам удалось выбрать тот самый тур, где я смог и отдохнуть и насладиться первым опытом катания. Очень удобно, что всё выбрал в одном месте.'
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
          <div className={style.clients__title_small}>
            Опыт тех, кто уже катался с нами
          </div>
        </div>
        <div className={style.clients__text}>
          Как это было на самом деле.
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

