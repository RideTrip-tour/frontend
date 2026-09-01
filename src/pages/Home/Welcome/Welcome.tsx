import style from './welcome.module.scss'
import IconSelect from '@/shared/ui/base/IconSelect'
import {Button} from '@/shared/ui/base/Button'
import {useState} from 'react'

const locations = [
  {value: 'turkey', label: 'Турция'},
  {value: 'egypt', label: 'Египет'},
  {value: 'italy', label: 'Италия'}
]

const dates = [
  {value: 'may', label: 'Май 2026'},
  {value: 'june', label: 'Июнь 2026'},
  {value: 'july', label: 'Июль 2026'}
]

const activities = [
  {value: 'snowboard', label: 'Сноуборд'},
  {value: 'diving', label: 'Дайвинг'},
  {value: 'hiking', label: 'Хайкинг'}
]

function Welcome() {
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [activity, setActivity] = useState('')

  const handleSearch = () => {
    console.log({
      location,
      date,
      activity
    })
  }

  return (
    <>
      <div className={style.welcome}>
        <div className={style.welcome__text}>
          <div className={style.welcome__text_medium}>
            До поездки осталось
          </div>
          <div className={style.welcome__text_large}>
            три шага
          </div>
        </div>
        <div className={style.welcome__search}>
          <IconSelect
            options={locations}
            value={location}
            onChange={setLocation}
            text="Местоположение"
            placeholder="Выберите направление"
            icon="weui:location-filled"
            iconColor="#1E4D8F"
            iconBg="rgba(30,77,143,0.10)"
          />

          <IconSelect
            options={dates}
            value={date}
            onChange={setDate}
            text="Даты"
            placeholder="Выберите даты"
            icon="lets-icons:date-fill"
            iconColor="#FF8A00"
            iconBg="rgba(255,138,0,0.10)"
          />

          <IconSelect
            options={activities}
            value={activity}
            onChange={setActivity}
            text="Спорт и отдых"
            placeholder='Например, "Сноуборд"'
            icon="ic:round-directions-run"
            iconColor="#3CB371"
            iconBg="rgba(60,179,113,0.10)"
          />

          <Button
            onClick={handleSearch}
            text="Найти мой тур"
            variant={'secondary'}
            icon="material-symbols:arrow-forward-rounded"
          />
        </div>
      </div>
    </>
  )
}

export default Welcome

