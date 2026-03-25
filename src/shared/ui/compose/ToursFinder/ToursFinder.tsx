import { useState } from 'react'
import style from './toursFinder.module.scss'
import './variables.css'
import Select from '@/shared/ui/base/Select'
import Input from '@/shared/ui/base/Input'
import {Icon} from '@iconify/react'

const activityOptions = [
  { value: 'snowboard', label: 'Сноуборд' },
  { value: 'ski', label: 'Лыжи' },
  { value: 'hiking', label: 'Походы' }
]

const budgetOptions = [
  { value: '10000', label: '10.000 ₽' },
  { value: '20000', label: '20.000 ₽' },
  { value: '50000', label: '50.000 ₽' }
]

const levelOptions = [
  { value: 'novice', label: 'Новичок' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' }
]

const styleOptions = [
  { value: 'relax', label: 'Отдых' },
  { value: 'adventure', label: 'Приключения' }
]

const durationOptions = [
  { value: '3-5', label: '3-5 дней' },
  { value: '6-10', label: '6-10 дней' }
]

const transportOptions = [
  { value: 'plane', label: 'Самолет' },
  { value: 'train', label: 'Поезд' },
  { value: 'bus', label: 'Автобус' },
  { value: 'car', label: 'Личный транспорт' }
]

export const ToursFinder = () => {
  const [destination, setDestination] = useState('')
  const [activity, setActivity] = useState('')
  const [budget, setBudget] = useState('')
  const [level, setLevel] = useState('')
  const [styleTour, setStyleTour] = useState('')
  const [duration, setDuration] = useState('')
  const [transport, setTransport] = useState('')

  const [openSelect, setOpenSelect] = useState<string | null>(null)

  const handleSearch = () => {
    alert('Ищем тур...')
  }

  return (
    <div className={style.toursFinder}>
      <div className={style.input}>
        <div className={style.groupTitle}>Направление</div>
        <Input
          placeholder='Укажите место назначения, например “Сочи”'
          onSubmit={setDestination}
        />
      </div>

      <div className={style.grid}>
        <div className={style.group}>
          <div className={style.groupTitle}>Стиль</div>
          <Select
            options={styleOptions}
            value={styleTour}
            onChange={setStyleTour}
            placeholder='Выберите стиль'
            isOpen={openSelect === 'style'}
            onToggle={() =>
              setOpenSelect(openSelect === 'style' ? null : 'style')
            }
          />
        </div>

        <div className={style.group}>
          <div className={style.groupTitle}>Длительность поездки</div>
          <Select
            options={durationOptions}
            value={duration}
            onChange={setDuration}
            placeholder='Длительность поездки'
            isOpen={openSelect === 'duration'}
            onToggle={() =>
              setOpenSelect(openSelect === 'duration' ? null : 'duration')
            }
          />
        </div>

        <div className={style.group}>
          <div className={style.groupTitle}>Активность</div>
          <Select
            options={activityOptions}
            value={activity}
            onChange={setActivity}
            placeholder='Выберите активность'
            isOpen={openSelect === 'activity'}
            onToggle={() =>
              setOpenSelect(openSelect === 'activity' ? null : 'activity')
            }
          />
        </div>

        <div className={style.group}>
          <div className={style.groupTitle}>Бюджет</div>
          <Select
            options={budgetOptions}
            value={budget}
            onChange={setBudget}
            placeholder='Запланируйте бюджет'
            isOpen={openSelect === 'budget'}
            onToggle={() =>
              setOpenSelect(openSelect === 'budget' ? null : 'budget')
            }
          />
        </div>

        <div className={style.group}>
          <div className={style.groupTitle}>Ваш уровень</div>
          <Select
            options={levelOptions}
            value={level}
            onChange={setLevel}
            placeholder='Ваш уровень'
            isOpen={openSelect === 'level'}
            onToggle={() =>
              setOpenSelect(openSelect === 'level' ? null : 'level')
            }
          />
        </div>

        <div className={style.group}>
          <div className={style.groupTitle}>Как добираться</div>
          <Select
            options={transportOptions}
            value={transport}
            onChange={setTransport}
            placeholder='Например, “Самолет”'
            isOpen={openSelect === 'transport'}
            onToggle={() =>
              setOpenSelect(openSelect === 'transport' ? null : 'transport')
            }
          />
        </div>
      </div>

      <div className={style.toursFinder__button}>
        <div className={style.toursFinder__button__btn}
             onClick={handleSearch}
        >
          <span>Найти мой идеальный тур</span>
          <Icon icon="material-symbols:arrow-forward-rounded"
                width={28}
          />
        </div>
      </div>
    </div>
  )
}

export default ToursFinder