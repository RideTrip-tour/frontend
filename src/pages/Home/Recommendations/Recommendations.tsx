import style from './recommendations.module.scss'
import ToggleText from '@/shared/ui/base/ToggleText/ToggleText'
import ResortSlider from '@/shared/ui/compose/ResortSlider'
import type {BigResortCardProps} from '@/shared/ui/compose/BigResortCard/BigResortCard.tsx'
import BigResortCard from '@/shared/ui/compose/BigResortCard/BigResortCard.tsx'

function Recommendations() {

  const cards: BigResortCardProps[] = [
    {
      image: '/assets/images/imageBG.png',
      title: 'Шерегеш, Россия',
      level: 1,
      badgeText: 'Рекомендуем',
      rating: 4.75,
      reviews: 120,
      category: 'Трассовое катание',
      price: 45600,
      info: ['Аренда оборудования', 'Wi-Fi на территории', 'Детская зона'],
      conditions: ['tracks', 'lift', 'snow', 'transfer']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Сочи, Россия',
      level: 2,
      rating: 4.5,
      reviews: 98,
      category: 'Фрирайд',
      price: 52000,
      info: ['Прокат лыж', 'Spa-зона', 'Трансфер включён'],
      conditions: ['lift', 'snow', 'transfer']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Эльбрус, Россия',
      level: 3,
      badgeText: 'Хит сезона',
      rating: 4.9,
      reviews: 204,
      category: 'Экстремальное',
      price: 68000,
      info: ['Гид включён', 'Страховка', 'Питание'],
      conditions: ['tracks', 'snow']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Архыз, Россия',
      level: 1,
      rating: 4.3,
      reviews: 57,
      category: 'Трассовое катание',
      price: 38000,
      info: ['Аренда оборудования', 'Детская зона'],
      conditions: ['tracks', 'lift', 'transfer']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Домбай, Россия',
      level: 2,
      rating: 4.6,
      reviews: 143,
      category: 'Горные лыжи',
      price: 41500,
      info: ['Wi-Fi на территории', 'Прокат лыж', 'Ресторан'],
      conditions: ['lift', 'snow', 'tracks']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Красная Поляна',
      level: 2,
      badgeText: 'Популярное',
      rating: 4.8,
      reviews: 317,
      category: 'Трассовое катание',
      price: 59900,
      info: ['Аренда оборудования', 'Spa-зона', 'Wi-Fi'],
      conditions: ['tracks', 'lift', 'snow', 'transfer']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Абзаково, Башкортостан',
      level: 1,
      rating: 4.1,
      reviews: 44,
      category: 'Семейное катание',
      price: 29000,
      info: ['Детская зона', 'Трансфер включён'],
      conditions: ['tracks', 'transfer']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Банное, Башкортостан',
      level: 1,
      rating: 4.2,
      reviews: 61,
      category: 'Горные лыжи',
      price: 31000,
      info: ['Аренда оборудования', 'Питание'],
      conditions: ['lift', 'tracks']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Хибины, Мурманск',
      level: 3,
      badgeText: 'Новинка',
      rating: 4.7,
      reviews: 89,
      category: 'Фрирайд',
      price: 73000,
      info: ['Гид включён', 'Страховка', 'Wi-Fi'],
      conditions: ['snow', 'tracks', 'transfer']
    },
    {
      image: '/assets/images/imageBG.png',
      title: 'Завьялиха, Челябинск',
      level: 0,
      rating: 3.9,
      reviews: 28,
      category: 'Начинающим',
      price: 22000,
      info: ['Инструктор', 'Аренда оборудования'],
      conditions: ['lift', 'tracks']
    }
  ]

  return (
    <>
      <div className={style.recommendations}>
        <div className={style.recommendations__title}>
          Итак, ваше путешествие
        </div>
        <div className={style.recommendations__text}>
          Если вы уже знаете чего хотите, мы покажем где можно это сделать.
        </div>
        <div className={style.recommendations__filters}>
          <ToggleText name={'Все туры'} defaultOn width={230}/>
          <ToggleText name={'Для первого раза'} width={230}/>
          <ToggleText name={'Уверенно и быстро'} width={230}/>
          <ToggleText name={'Экстрим и фрирайд'} width={230}/>
          <ToggleText name={'Семейные курорты'} width={230}/>
        </div>
        <div className={style.recommendations__slider}>
          <ResortSlider
            items={cards.map((card, index) => (
              <BigResortCard key={index} {...card} />
            ))}
          />
        </div>
      </div>
    </>
  )
}

export default Recommendations
