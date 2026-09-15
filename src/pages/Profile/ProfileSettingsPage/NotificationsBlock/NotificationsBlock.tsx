import { useState } from 'react'
import style from './notificationsblock.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import SectionHeader from '@/shared/ui/base/SectionHeader'
import Divider from '@/shared/ui/base/Divider'
import ToggleRow from '@/shared/ui/base/ToggleRow'
import CheckOption from '@/shared/ui/compose/CheckOption'
import { useProfileStore } from '@/store'
import './variables.css'

const HOW_TO_RECEIVE = [
  { key: 'email', label: 'Email', defaultChecked: true },
  { key: 'push', label: 'Push-уведомления', defaultChecked: false },
  { key: 'phone', label: 'По номеру телефона', defaultChecked: false },
]

const WHAT_TO_RECEIVE = [
  {
    key: 'picks',
    title: 'Подборки по моим предпочтениям',
    description: 'Новые туры которые подходят вашему профилю',
  },
  {
    key: 'priceDrop',
    title: 'Снижение цены на избранные туры',
    description: 'Сообщим если цена упадёт',
  },
  {
    key: 'hot',
    title: 'Горящие туры',
    description: 'Спецпредложения с ограниченным сроком',
  },
]

const SERVICE_NOTIFICATIONS = [
  { key: 'booking', label: 'Подтверждение бронирования', defaultChecked: false },
  { key: 'changes', label: 'Изменения в туре', defaultChecked: true },
  { key: 'trip', label: 'Важные уведомления по поездке', defaultChecked: true },
]

function NotificationsBlock() {
  const saved = useProfileStore(s => s.notifications)
  const setNotifications = useProfileStore(s => s.setNotifications)

  const [howToReceive, setHowToReceive] = useState(() =>
    Object.fromEntries(HOW_TO_RECEIVE.map(item => [item.key, false]))
  )
  const [whatToReceive, setWhatToReceive] = useState(() =>
    Object.fromEntries(WHAT_TO_RECEIVE.map(item => [item.key, false]))
  )
  const [serviceNotifications, setServiceNotifications] = useState(() =>
    Object.fromEntries(SERVICE_NOTIFICATIONS.map(item => [item.key, false]))
  )

  const notify = (patch: { howToReceive?: Record<string, boolean>; whatToReceive?: Record<string, boolean>; serviceNotifications?: Record<string, boolean> }) => {
    setNotifications({
      howToReceive,
      whatToReceive,
      serviceNotifications,
      ...patch,
    })
  }

  return (
    <PageSection paddingVertical={32} paddingHorizontal={40}>
      <div className={style.notificationsblock}>
        <SectionHeader
          title="Уведомления"
          subtitle="Выберите что и как вы хотите получать"
        />
        <Divider />
        <div className={style.notificationsblock__group}>
          <div className={style.notificationsblock__groupTitle}>
            Как получать
          </div>
          <div className={`${style.notificationsblock__toggles} ${style['notificationsblock__toggles--tight']}`}>
            {HOW_TO_RECEIVE.map(item => (
              <ToggleRow
                key={item.key}
                label={item.label}
                checked={Boolean((saved.howToReceive ?? howToReceive)[item.key])}
                onChange={value => {
                  const next = { ...saved.howToReceive, [item.key]: value }
                  setHowToReceive(prev => ({ ...prev, [item.key]: value }))
                  notify({ howToReceive: next })
                }}
              />
            ))}
          </div>
        </div>
        <Divider />
        <div className={style.notificationsblock__group}>
          <div className={style.notificationsblock__groupTitle}>
            Что получать
          </div>
          <div className={style.notificationsblock__checks}>
            {WHAT_TO_RECEIVE.map(item => (
              <CheckOption
                key={item.key}
                checked={Boolean(whatToReceive[item.key])}
                onChange={value => setWhatToReceive(prev => ({ ...prev, [item.key]: value }))}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
        <Divider />
        <div className={style.notificationsblock__group}>
          <div className={style.notificationsblock__groupTitle}>
            Сервисные
          </div>
          <div className={style.notificationsblock__toggles}>
            {SERVICE_NOTIFICATIONS.map(item => (
              <ToggleRow
                key={item.key}
                label={item.label}
                checked={Boolean(serviceNotifications[item.key])}
                onChange={value => setServiceNotifications(prev => ({ ...prev, [item.key]: value }))}
              />
            ))}
          </div>
        </div>
      </div>
    </PageSection>
  )
}

export default NotificationsBlock